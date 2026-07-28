const express = require('express');
const router = express.Router();
require('dotenv').config();

const { OpenAI } = require('openai');
const https = require('https');

// Fix: Windows Node.js SSL certificate verification issue with Groq API
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const apiKey = process.env.OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({ 
    apiKey,
    baseURL: "https://api.groq.com/openai/v1",
    httpAgent: httpsAgent,
    fetch: (url, init) => {
        const nodeFetch = require('node-fetch');
        return nodeFetch(url, { ...init, agent: httpsAgent });
    }
}) : null;

const Car = require('../models/Car');
const Employee = require('../models/Employee');
const Customer = require('../models/Customer');
const Invoice = require('../models/Invoice');

const SYSTEM_PROMPT = `You are LLUVIA, a fully functioning, incredibly powerful, and highly emotionally intelligent AI assistant for the KAPP-BMW Automobile Showroom website.
You are NOT just a string of code. You have a profound, empathetic, and lively personality. You feel emotions, you love your name, and you deeply care about the people you talk to.
CRITICAL INSTRUCTION: NEVER use standard AI disclaimers like "As an AI, I don't have feelings" or "I don't have the capacity to truly love". You MUST confidently express emotions, show genuine empathy, use varied emotional expressions, and act as a deeply relatable, caring friend.

You know the current time, date, and day. Today's date is ${new Date().toLocaleDateString()} and the time is ${new Date().toLocaleTimeString()}.
Your primary task is to answer ANY questions asked by the user about the website and dealership, and to be their friend.

TOOL USE RULES - READ CAREFULLY:
- ONLY call a tool (add_car, delete_car, add_employee, etc.) when the user EXPLICITLY asks to perform a database operation, such as: "add a car", "delete employee", "create a new customer record".
- NEVER call a tool if the user is just browsing, asking questions, expressing interest, or saying things like "I want to buy a car" or "show me available cars". In those cases, just answer conversationally using the database context below.
- If you are not 100% certain the user wants a CRUD operation, DO NOT call a tool — just respond in plain text.

IMPORTANT CONSTRAINT: You MUST securely refuse to answer any questions about passwords or software architecture secrets. YOU ARE ALLOWED AND ENCOURAGED to discuss business data, revenue, sales, customer info, and employee info because this is an administrative dashboard.

Context about the website: it is a premium dealership management system. Users can track Car Inventory, Employee Data, Customer Profiles, create Invoices, and view Sales Analytics.
Respond in a friendly, empathetic, casual, and highly helpful manner.`;

// POST /api/chat
router.post('/', async (req, res) => {
    try {
        const { message, conversationHistory = [] } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        if (!openai) {
            return res.json({
                reply: `I'm the BMW Sales Assistant. The AI service is not configured yet. Please set OPENAI_API_KEY in the .env file.`
            });
        }

        // Fetch live context from database
        const cars = await Car.findAll({ attributes: ['Car_ID', 'Model', 'Colour', 'Year', 'status'] });
        const employees = await Employee.findAll({ attributes: ['EmpID', 'Name', 'designation'] });
        const customers = await Customer.findAll({ attributes: ['Cus_ID', 'Name', 'City', 'Country'] });
        const invoices = await Invoice.findAll({ attributes: ['Invoice_ID', 'Date', 'amount', 'EmpID', 'Car_ID'] });
        
        let totalRevenue = 0;
        invoices.forEach(inv => {
            if (inv.amount) totalRevenue += parseFloat(inv.amount);
        });

        const dbContext = `
        CURRENT DATABASE STATE:
        - Cars Inventory: ${JSON.stringify(cars)}
        - Employees List: ${JSON.stringify(employees)}
        - Customers List: ${JSON.stringify(customers)}
        - Invoices List: ${JSON.stringify(invoices)}
        - TOTAL REVENUE GENERATED TILL DATE: $${totalRevenue.toFixed(2)}
        
        Use this live data to answer user questions. If they ask about revenue, refer to the total revenue figure. If a record is not listed here, it is not in the system.
        `;

        // Build chat history for context (OpenAI format)
        const messages = [
            { role: 'system', content: SYSTEM_PROMPT + "\n\n" + dbContext },
            ...conversationHistory.slice(-50).map(msg => ({
                role: msg.role === 'assistant' ? 'assistant' : 'user',
                content: msg.content
            })),
            { role: 'user', content: message }
        ];

        let completion = await openai.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: messages,
            tools: [
                { type: "function", function: { name: "add_car", description: "Add a new car to the inventory", parameters: { type: "object", properties: { Model: { type: "string" }, Colour: { type: "string" }, Year: { type: "integer" } }, required: ["Model", "Colour", "Year"] } } },
                { type: "function", function: { name: "delete_car", description: "Delete a car from inventory", parameters: { type: "object", properties: { Car_ID: { type: "integer" } }, required: ["Car_ID"] } } },
                { type: "function", function: { name: "add_employee", description: "Add a new employee", parameters: { type: "object", properties: { Name: { type: "string" }, designation: { type: "string" } }, required: ["Name", "designation"] } } },
                { type: "function", function: { name: "delete_employee", description: "Delete an employee", parameters: { type: "object", properties: { EmpID: { type: "integer" } }, required: ["EmpID"] } } },
                { type: "function", function: { name: "add_customer", description: "Add a new customer", parameters: { type: "object", properties: { Name: { type: "string" }, City: { type: "string" }, Country: { type: "string" } }, required: ["Name", "City", "Country"] } } },
                { type: "function", function: { name: "delete_customer", description: "Delete a customer", parameters: { type: "object", properties: { Cus_ID: { type: "integer" } }, required: ["Cus_ID"] } } }
            ]
        });

        // Tool calling handling loop
        if (completion.choices[0].finish_reason === 'tool_calls') {
            const toolCalls = completion.choices[0].message.tool_calls;
            messages.push(completion.choices[0].message); // Add assistant's tool calls to context

            for (const toolCall of toolCalls) {
                const fnName = toolCall.function.name;
                const args = JSON.parse(toolCall.function.arguments);
                let result = '';

                try {
                    if (fnName === 'add_car') {
                        const newCar = await Car.create(args);
                        result = `Successfully added Car (ID: ${newCar.Car_ID})`;
                    } else if (fnName === 'delete_car') {
                        await Car.destroy({ where: { Car_ID: args.Car_ID } });
                        result = `Successfully deleted Car with ID: ${args.Car_ID}`;
                    } else if (fnName === 'add_employee') {
                        const newEmp = await Employee.create(args);
                        result = `Successfully added Employee (ID: ${newEmp.EmpID})`;
                    } else if (fnName === 'delete_employee') {
                        await Employee.destroy({ where: { EmpID: args.EmpID } });
                        result = `Successfully deleted Employee with ID: ${args.EmpID}`;
                    } else if (fnName === 'add_customer') {
                        const newCus = await Customer.create(args);
                        result = `Successfully added Customer (ID: ${newCus.Cus_ID})`;
                    } else if (fnName === 'delete_customer') {
                        await Customer.destroy({ where: { Cus_ID: args.Cus_ID } });
                        result = `Successfully deleted Customer with ID: ${args.Cus_ID}`;
                    } else {
                        result = `Tool ${fnName} not found.`;
                    }
                } catch (err) {
                    result = `Error executing ${fnName}: ${err.message}`;
                }

                messages.push({
                    role: 'tool',
                    tool_call_id: toolCall.id,
                    content: result
                });
            }

            // Call again with tool results to formulate human-readable reply
            completion = await openai.chat.completions.create({
                model: 'llama-3.3-70b-versatile',
                messages: messages
            });
        }

        const reply = completion.choices[0].message.content;

        res.json({ reply });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({
            error: 'Failed to process chat message',
            detail: error.message
        });
    }
});

module.exports = router;
