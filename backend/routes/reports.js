const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

/**
 * Reports routes — call cursor-based stored procedures
 * All procedures use MySQL CURSORs internally to iterate records.
 */

// GET /api/reports/sales
// Calls GenerateEmployeeSalesReport() — cursor iterates all employees
router.get('/sales', async (req, res) => {
    try {
        const [results] = await sequelize.query('CALL GenerateEmployeeSalesReport()');
        // MySQL CALL returns an array; first element is the result set
        res.json(results[0] || results);
    } catch (error) {
        console.error('Error generating sales report:', error);
        res.status(500).json({
            error: 'Failed to generate sales report',
            detail: error.message
        });
    }
});

// GET /api/reports/available-cars
// Calls GetAvailableCarsSummary() — cursor iterates available cars
router.get('/available-cars', async (req, res) => {
    try {
        const [results] = await sequelize.query('CALL GetAvailableCarsSummary()');
        res.json(results[0] || results);
    } catch (error) {
        console.error('Error fetching available cars summary:', error);
        res.status(500).json({
            error: 'Failed to fetch available cars summary',
            detail: error.message
        });
    }
});

// GET /api/reports/customer/:id/history
// Calls GetCustomerPurchaseHistory(id) — cursor iterates customer's invoices
router.get('/customer/:id/history', async (req, res) => {
    try {
        const cusId = parseInt(req.params.id);
        if (isNaN(cusId)) {
            return res.status(400).json({ error: 'Invalid customer ID' });
        }
        const [results] = await sequelize.query(
            `CALL GetCustomerPurchaseHistory(${cusId})`
        );
        res.json(results[0] || results);
    } catch (error) {
        console.error('Error fetching customer history:', error);
        res.status(500).json({
            error: 'Failed to fetch customer purchase history',
            detail: error.message
        });
    }
});

module.exports = router;
