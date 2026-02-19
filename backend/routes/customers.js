const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Invoice = require('../models/Invoice');

// GET all customers
router.get('/', async (req, res) => {
    try {
        const customers = await Customer.findAll();
        res.json(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
});

// GET customer by ID (with invoices)
router.get('/:id', async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id, {
            include: [{ model: Invoice, as: 'invoices' }]
        });
        if (!customer) return res.status(404).json({ error: 'Customer not found' });
        res.json(customer);
    } catch (error) {
        console.error('Error fetching customer:', error);
        res.status(500).json({ error: 'Failed to fetch customer' });
    }
});

// POST create customer
router.post('/', async (req, res) => {
    try {
        const { Name, Ph_No, Address, City, Country } = req.body;
        const customer = await Customer.create({ Name, Ph_No, Address, City, Country });
        res.status(201).json(customer);
    } catch (error) {
        console.error('Error creating customer:', error);
        res.status(400).json({ error: error.message || 'Failed to create customer' });
    }
});

// PUT update customer
router.put('/:id', async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        if (!customer) return res.status(404).json({ error: 'Customer not found' });
        const { Name, Ph_No, Address, City, Country } = req.body;
        await customer.update({ Name, Ph_No, Address, City, Country });
        res.json(customer);
    } catch (error) {
        console.error('Error updating customer:', error);
        res.status(400).json({ error: 'Failed to update customer' });
    }
});

// DELETE customer
router.delete('/:id', async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        if (!customer) return res.status(404).json({ error: 'Customer not found' });
        await customer.destroy();
        res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).json({ error: 'Failed to delete customer' });
    }
});

module.exports = router;
