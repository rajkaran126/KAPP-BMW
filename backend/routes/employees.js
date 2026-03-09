const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const EmployeeQualification = require('../models/EmployeeQualification');
const Invoice = require('../models/Invoice');
const Car = require('../models/Car');

// GET all employees
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.findAll();
        res.json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ error: 'Failed to fetch employees' });
    }
});

// GET employee by ID
router.get('/:id', async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id, {
            include: [
                { model: Car, as: 'soldCars', through: { attributes: [] } }
            ]
        });
        if (!employee) return res.status(404).json({ error: 'Employee not found' });
        res.json(employee);
    } catch (error) {
        console.error('Error fetching employee:', error);
        res.status(500).json({ error: 'Failed to fetch employee' });
    }
});

// POST create employee
router.post('/', async (req, res) => {
    try {
        const { Name, Address, designation } = req.body;
        const employee = await Employee.create({ Name, Address, designation });
        res.status(201).json(employee);
    } catch (error) {
        console.error('Error creating employee:', error);
        res.status(400).json({ error: error.message || 'Failed to create employee' });
    }
});

// PUT update employee
router.put('/:id', async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        if (!employee) return res.status(404).json({ error: 'Employee not found' });

        const { Name, Address, designation } = req.body;
        await employee.update({ Name, Address, designation });

        res.json(employee);
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(400).json({ error: 'Failed to update employee' });
    }
});

// DELETE employee
router.delete('/:id', async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        if (!employee) return res.status(404).json({ error: 'Employee not found' });
        // clean up any old qualifications records for safety
        await EmployeeQualification.destroy({ where: { EmpID: req.params.id } });
        await employee.destroy();
        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ error: 'Failed to delete employee' });
    }
});

module.exports = router;
