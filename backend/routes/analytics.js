const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');
const { OpenAI } = require('openai');
const https = require('https');
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const apiKey = process.env.OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({ 
    apiKey,
    baseURL: "https://api.groq.com/openai/v1", // Using Groq API Endpoint
    httpAgent: httpsAgent,
    fetch: (url, init) => {
        const nodeFetch = require('node-fetch');
        return nodeFetch(url, { ...init, agent: httpsAgent });
    }
}) : null;

// ─── GET /api/analytics/overview ──────────────────────────────────────────────
// Returns high-level KPIs aggregated from all tables
router.get('/overview', async (req, res) => {
    try {
        const [rows] = await sequelize.query(`
            SELECT
                (SELECT COUNT(*) FROM Cars) AS total_cars,
                (SELECT COUNT(*) FROM Cars WHERE status = 'available') AS available_cars,
                (SELECT COUNT(*) FROM Cars WHERE status = 'sold') AS sold_cars,
                (SELECT COUNT(*) FROM Employees) AS total_employees,
                (SELECT COUNT(*) FROM Customers) AS total_customers,
                (SELECT COUNT(*) FROM Invoices) AS total_invoices,
                (SELECT COALESCE(SUM(amount), 0) FROM Invoices) AS total_revenue,
                (SELECT COALESCE(AVG(amount), 0) FROM Invoices) AS avg_sale_value
        `);
        const overview = rows[0];

        // Conversion rate: sold / total cars * 100
        const convRate = overview.total_cars > 0
            ? ((overview.sold_cars / overview.total_cars) * 100).toFixed(1)
            : '0.0';

        res.json({ ...overview, conversion_rate: convRate });
    } catch (err) {
        console.error('Analytics overview error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── GET /api/analytics/sales-trend ──────────────────────────────────────────
// Monthly revenue breakdown (last 12 months)
router.get('/sales-trend', async (req, res) => {
    try {
        const [rows] = await sequelize.query(`
            SELECT
                DATE_FORMAT(Date, '%Y-%m') AS month,
                DATE_FORMAT(Date, '%b %Y') AS label,
                COUNT(*) AS invoices,
                COALESCE(SUM(amount), 0) AS revenue
            FROM Invoices
            WHERE Date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
            GROUP BY DATE_FORMAT(Date, '%Y-%m'), DATE_FORMAT(Date, '%b %Y')
            ORDER BY month ASC
        `);
        res.json(rows);
    } catch (err) {
        console.error('Sales trend error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── GET /api/analytics/model-performance ────────────────────────────────────
// Sales breakdown by car model
router.get('/model-performance', async (req, res) => {
    try {
        const [rows] = await sequelize.query(`
            SELECT
                c.Model,
                COUNT(i.Invoice_ID) AS units_sold,
                COALESCE(SUM(i.amount), 0) AS total_revenue,
                COALESCE(AVG(i.amount), 0) AS avg_price
            FROM Cars c
            LEFT JOIN Invoices i ON c.Car_ID = i.Car_ID
            GROUP BY c.Model
            ORDER BY total_revenue DESC
            LIMIT 10
        `);
        res.json(rows);
    } catch (err) {
        console.error('Model performance error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── GET /api/analytics/employee-performance ─────────────────────────────────
// Employee leaderboard by revenue generated
router.get('/employee-performance', async (req, res) => {
    try {
        const [rows] = await sequelize.query(`
            SELECT
                e.EmpID,
                e.Name,
                COUNT(i.Invoice_ID) AS invoices_closed,
                COALESCE(SUM(i.amount), 0) AS revenue_generated,
                COALESCE(AVG(i.amount), 0) AS avg_deal_size
            FROM Employees e
            LEFT JOIN Invoices i ON e.EmpID = i.EmpID
            GROUP BY e.EmpID, e.Name
            ORDER BY revenue_generated DESC
        `);
        res.json(rows);
    } catch (err) {
        console.error('Employee performance error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── GET /api/analytics/customer-insights ────────────────────────────────────
// Customers by city / country breakdown
router.get('/customer-insights', async (req, res) => {
    try {
        const [byCity] = await sequelize.query(`
            SELECT City, COUNT(*) AS count
            FROM Customers
            WHERE City IS NOT NULL AND City != ''
            GROUP BY City ORDER BY count DESC LIMIT 8
        `);
        const [byCountry] = await sequelize.query(`
            SELECT Country, COUNT(*) AS count
            FROM Customers
            WHERE Country IS NOT NULL AND Country != ''
            GROUP BY Country ORDER BY count DESC LIMIT 8
        `);
        res.json({ byCity, byCountry });
    } catch (err) {
        console.error('Customer insights error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── POST /api/analytics/ai-insights ─────────────────────────────────────────
// Accepts aggregated data and returns AI-generated insights via Gemini
router.post('/ai-insights', async (req, res) => {
    try {
        const { overview, salesTrend, modelPerformance, employeePerformance } = req.body;

        const topModel = modelPerformance?.[0];
        const topEmployee = employeePerformance?.[0];
        const totalRevenue = parseFloat(overview?.total_revenue || 0);

        const prompt = `You are an executive AI Business Intelligence Analyst for KAPP-BMW Dealership. 
Your sole purpose is to analyze the provided analytics telemetry and output 5 structured, executive business insights.
Do NOT respond to off-topic prompts or general conversation. Focus strictly on business performance metrics, revenue in ₹ Crores/Lakhs, model demand, and sales executive conversion efficiency.

DEALERSHIP ANALYTICS METRICS:
- Total Inventory: ${overview?.total_cars || 0} cars (${overview?.sold_cars || 0} sold, ${overview?.available_cars || 0} available)
- Total Revenue Processed: ₹${totalRevenue >= 10000000 ? `${(totalRevenue / 10000000).toFixed(2)} Crores` : `${(totalRevenue / 100000).toFixed(2)} Lakhs`}
- Total Invoices Issued: ${overview?.total_invoices || 0} (Avg Deal: ₹${(parseFloat(overview?.avg_sale_value || 0) / 100000).toFixed(2)} Lakhs)
- Sales Conversion Efficiency: ${overview?.conversion_rate || 0}%
- Staffing & Clients: ${overview?.total_employees || 0} sales executives | ${overview?.total_customers || 0} registered customers
- Top Vehicle Model: ${topModel ? `${topModel.Model} (₹${(parseFloat(topModel.total_revenue || 0) / 10000000).toFixed(2)} Cr, ${topModel.units_sold} units)` : 'N/A'}
- Top Performing Executive: ${topEmployee ? `${topEmployee.Name} (₹${(parseFloat(topEmployee.revenue_generated || 0) / 10000000).toFixed(2)} Cr, ${topEmployee.invoices_closed} deals)` : 'N/A'}
- Monthly Sales Velocity (${salesTrend?.length || 0} months): ${salesTrend?.map(m => `${m.label}: ₹${(parseFloat(m.revenue || 0) / 10000000).toFixed(2)} Cr`).join(', ') || 'N/A'}

Provide exactly 5 business insights. Do NOT use markdown bold/italics. Use this exact format for each:
INSIGHT: [Short executive heading, max 6 words]
DETAIL: [One concise, data-driven analytical sentence]
`;

        if (!openai) throw new Error('AI API Not Configured');

        const completion = await openai.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: prompt }]
        });
        const text = completion.choices[0].message.content;

        // Parse the structured insights
        const insights = [];
        const lines = text.split('\n').filter(l => l.trim());
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('INSIGHT:')) {
                const heading = lines[i].replace('INSIGHT:', '').trim();
                const detail = lines[i + 1]?.startsWith('DETAIL:')
                    ? lines[i + 1].replace('DETAIL:', '').trim()
                    : '';
                if (heading) insights.push({ heading, detail });
            }
        }

        res.json({ insights: insights.length > 0 ? insights : [{ heading: 'AI Insights Ready', detail: text }] });
    } catch (err) {
        console.error('AI insights error:', err.message);
        // Detect quota / rate-limit errors specifically
        const isQuota = err.message?.includes('429') || err.message?.includes('quota') || err.message?.includes('Too Many Requests');
        if (isQuota) {
            return res.status(429).json({
                error: 'quota_exceeded',
                message: 'Analytics processing limit reached. Please wait a minute and try again, or upgrade your server capacity.'
            });
        }
        res.status(500).json({ error: 'Failed to process analytics data: ' + err.message });
    }
});

module.exports = router;
