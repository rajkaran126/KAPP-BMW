const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

/**
 * Reports routes — call cursor-based stored procedures
 * All procedures use MySQL CURSORs internally to iterate records.
 */

// GET /api/reports/sales
// Calls GenerateEmployeeSalesReport() or falls back to direct query
router.get('/sales', async (req, res) => {
    try {
        let data = [];
        try {
            const [results] = await sequelize.query('CALL GenerateEmployeeSalesReport()');
            data = results[0] || results;
        } catch (procErr) {
            console.warn('Procedure not found, using fallback query:', procErr.message);
            const [results] = await sequelize.query(`
                SELECT 
                    e.EmpID, 
                    e.Name AS EmployeeName, 
                    COUNT(i.Invoice_ID) AS total_invoices, 
                    COALESCE(SUM(i.amount), 0) AS total_amount, 
                    COUNT(DISTINCT i.Car_ID) AS cars_sold
                FROM Employees e
                LEFT JOIN Invoices i ON e.EmpID = i.EmpID
                GROUP BY e.EmpID, e.Name
                ORDER BY total_amount DESC
            `);
            data = results;
        }
        res.json({ data: Array.isArray(data) ? data : [] });
    } catch (error) {
        console.error('Error generating sales report:', error);
        res.status(500).json({ error: 'Failed to generate sales report', detail: error.message });
    }
});

// GET /api/reports/available-cars
// Calls GetAvailableCarsSummary() or falls back to direct query
router.get('/available-cars', async (req, res) => {
    try {
        let data = [];
        try {
            const [results] = await sequelize.query('CALL GetAvailableCarsSummary()');
            data = results[0] || results;
        } catch (procErr) {
            console.warn('Procedure not found, using fallback query:', procErr.message);
            const [results] = await sequelize.query(`
                SELECT 
                    c.Car_ID, 
                    c.Model, 
                    c.Colour, 
                    c.Year, 
                    c.IL_No, 
                    COUNT(ec.EmpID) AS seller_count
                FROM Cars c
                LEFT JOIN EmployeeCar ec ON c.Car_ID = ec.Car_ID
                WHERE c.status = 'available'
                GROUP BY c.Car_ID, c.Model, c.Colour, c.Year, c.IL_No
            `);
            data = results;
        }
        res.json({ data: Array.isArray(data) ? data : [] });
    } catch (error) {
        console.error('Error fetching available cars summary:', error);
        res.status(500).json({ error: 'Failed to fetch available cars summary', detail: error.message });
    }
});

// GET /api/reports/customer/:id/history
router.get('/customer/:id/history', async (req, res) => {
    try {
        const cusId = parseInt(req.params.id);
        if (isNaN(cusId)) {
            return res.status(400).json({ error: 'Invalid customer ID' });
        }
        let data = [];
        try {
            const [results] = await sequelize.query(`CALL GetCustomerPurchaseHistory(${cusId})`);
            data = results[0] || results;
        } catch (procErr) {
            const [results] = await sequelize.query(`
                SELECT i.Invoice_ID, i.Date, i.amount, c.Model, e.Name AS SalesRep
                FROM Invoices i
                JOIN Cars c ON i.Car_ID = c.Car_ID
                JOIN Employees e ON i.EmpID = e.EmpID
                WHERE i.Cus_ID = ${cusId}
                ORDER BY i.Date DESC
            `);
            data = results;
        }
        res.json({ data: Array.isArray(data) ? data : [] });
    } catch (error) {
        console.error('Error fetching customer history:', error);
        res.status(500).json({ error: 'Failed to fetch customer purchase history', detail: error.message });
    }
});

module.exports = router;
