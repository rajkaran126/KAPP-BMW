const express = require('express');
const router = express.Router();
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const SYSTEM_PROMPT = `You are a helpful BMW Sales Management assistant for KAPP-BMW Automobile Showroom.
You help staff and customers with queries about cars, employees, customers, and sales invoices.
The system manages:
- Employees (EmpID, Name, Address, Qualifications)
- Cars (Car_ID, IL_No, Mod_No, Model, Colour, Year, status: available/sold)
- Customers (Cus_ID, Name, Ph_No, Address, City, Country)
- Invoices (Invoice_ID, Date, Amount — linking Employee, Car, and Customer)
- Reports: Employee sales summary, available cars summary, customer purchase history

Be concise, professional, and helpful. If asked about BMW models, you can provide general knowledge about BMW cars.`;

// POST /api/chat
router.post('/', async (req, res) => {
    try {
        const { message, conversationHistory = [] } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        if (!genAI) {
            return res.json({
                reply: `I'm the BMW Sales Assistant. The AI service is not configured yet. Please set GEMINI_API_KEY in the .env file.`
            });
        }

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            systemInstruction: SYSTEM_PROMPT
        });

        // Build chat history for context (Gemini format)
        const history = conversationHistory
            .slice(-10) // keep last 10 messages for context
            .map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            }));

        const chat = model.startChat({ history });
        const result = await chat.sendMessage(message);
        const reply = result.response.text();

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
