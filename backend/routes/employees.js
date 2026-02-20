const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const EmployeeQualification = require('../models/EmployeeQualification');
const Invoice = require('../models/Invoice');
const Car = require('../models/Car');

// GET all employees (with qualifications)
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.findAll({
            include: [{ model: EmployeeQualification, as: 'qualifications' }]
        });
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
                { model: EmployeeQualification, as: 'qualifications' },
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
        const { Name, Address, qualifications } = req.body;
        const employee = await Employee.create({ Name, Address });

        // Add qualifications if provided
        if (qualifications && Array.isArray(qualifications)) {
            for (const q of qualifications) {
                await EmployeeQualification.create({ EmpID: employee.EmpID, qualification: q });
            }
        }

        const result = await Employee.findByPk(employee.EmpID, {
            include: [{ model: EmployeeQualification, as: 'qualifications' }]
        });
        res.status(201).json(result);
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

        const { Name, Address, qualifications } = req.body;
        await employee.update({ Name, Address });

        // Update qualifications if provided
        if (qualifications !== undefined) {
            // Remove old
            await EmployeeQualification.destroy({ where: { EmpID: employee.EmpID } });

            // Add new
            if (Array.isArray(qualifications)) {
                for (const q of qualifications) {
                    if (q.trim()) {
                        await EmployeeQualification.create({ EmpID: employee.EmpID, qualification: q.trim() });
                    }
                }
            }
        }

        const result = await Employee.findByPk(employee.EmpID, {
            include: [{ model: EmployeeQualification, as: 'qualifications' }]
        });
        res.json(result);
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
        await EmployeeQualification.destroy({ where: { EmpID: req.params.id } });
        await employee.destroy();
        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ error: 'Failed to delete employee' });
    }
});

// GET qualifications for an employee
router.get('/:id/qualifications', async (req, res) => {
    try {
        const qualifications = await EmployeeQualification.findAll({
            where: { EmpID: req.params.id }
        });
        res.json(qualifications);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch qualifications' });
    }
});

// POST add qualification to employee
router.post('/:id/qualifications', async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        if (!employee) return res.status(404).json({ error: 'Employee not found' });
        const { qualification } = req.body;
        const q = await EmployeeQualification.create({ EmpID: req.params.id, qualification });
        res.status(201).json(q);
    } catch (error) {
        res.status(400).json({ error: 'Failed to add qualification' });
    }
});

// DELETE a qualification
router.delete('/:id/qualifications/:qid', async (req, res) => {
    try {
        const q = await EmployeeQualification.findByPk(req.params.qid);
        if (!q) return res.status(404).json({ error: 'Qualification not found' });
        await q.destroy();
        res.json({ message: 'Qualification removed' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete qualification' });
    }
});

module.exports = router;
