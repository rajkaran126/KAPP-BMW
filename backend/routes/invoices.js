const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const Employee = require('../models/Employee');
const Car = require('../models/Car');
const Customer = require('../models/Customer');

// GET all invoices
router.get('/', async (req, res) => {
    try {
        const invoices = await Invoice.findAll({
            include: [
                { model: Employee, as: 'employee' },
                { model: Car, as: 'car' },
                { model: Customer, as: 'customer' }
            ],
            order: [['Date', 'DESC']]
        });
        res.json(invoices);
    } catch (error) {
        console.error('Error fetching invoices:', error);
        res.status(500).json({ error: 'Failed to fetch invoices' });
    }
});

// GET invoice by ID
router.get('/:id', async (req, res) => {
    try {
        const invoice = await Invoice.findByPk(req.params.id, {
            include: [
                { model: Employee, as: 'employee' },
                { model: Car, as: 'car' },
                { model: Customer, as: 'customer' }
            ]
        });
        if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
        res.json(invoice);
    } catch (error) {
        console.error('Error fetching invoice:', error);
        res.status(500).json({ error: 'Failed to fetch invoice' });
    }
});

// POST create invoice
router.post('/', async (req, res) => {
    try {
        const { Date: invoiceDate, amount, EmpID, Car_ID, Cus_ID } = req.body;

        // Validate all FKs exist
        const [employee, car, customer] = await Promise.all([
            Employee.findByPk(EmpID),
            Car.findByPk(Car_ID),
            Customer.findByPk(Cus_ID)
        ]);

        if (!employee) return res.status(400).json({ error: 'Employee not found' });
        if (!car) return res.status(400).json({ error: 'Car not found' });
        if (!customer) return res.status(400).json({ error: 'Customer not found' });

        const invoice = await Invoice.create({
            Date: invoiceDate || new Date(),
            amount,
            EmpID,
            Car_ID,
            Cus_ID
        });

        // NOTE: Car status ('sold') and EmployeeCar (SELLS) are updated
        // automatically by MySQL triggers:
        //   - trg_after_invoice_insert_mark_sold
        //   - trg_after_invoice_insert_sells

        const result = await Invoice.findByPk(invoice.Invoice_ID, {
            include: [
                { model: Employee, as: 'employee' },
                { model: Car, as: 'car' },
                { model: Customer, as: 'customer' }
            ]
        });
        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating invoice:', error);
        res.status(400).json({ error: error.message || 'Failed to create invoice' });
    }
});

// DELETE invoice
router.delete('/:id', async (req, res) => {
    try {
        const invoice = await Invoice.findByPk(req.params.id);
        if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
        await invoice.destroy();
        res.json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        console.error('Error deleting invoice:', error);
        res.status(500).json({ error: 'Failed to delete invoice' });
    }
});

module.exports = router;
