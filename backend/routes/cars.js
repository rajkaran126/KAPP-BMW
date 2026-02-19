const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
const Employee = require('../models/Employee');
const EmployeeQualification = require('../models/EmployeeQualification');

// GET all cars
router.get('/', async (req, res) => {
    try {
        const cars = await Car.findAll({
            include: [
                {
                    model: Employee,
                    as: 'sellers',
                    through: { attributes: [] },
                    include: [{ model: EmployeeQualification, as: 'qualifications' }]
                }
            ]
        });
        res.json(cars);
    } catch (error) {
        console.error('Error fetching cars:', error);
        res.status(500).json({ error: 'Failed to fetch cars' });
    }
});

// GET car by ID
router.get('/:id', async (req, res) => {
    try {
        const car = await Car.findByPk(req.params.id, {
            include: [
                {
                    model: Employee,
                    as: 'sellers',
                    through: { attributes: [] }
                }
            ]
        });
        if (!car) return res.status(404).json({ error: 'Car not found' });
        res.json(car);
    } catch (error) {
        console.error('Error fetching car:', error);
        res.status(500).json({ error: 'Failed to fetch car' });
    }
});

// POST create new car
router.post('/', async (req, res) => {
    try {
        const { IL_No, Mod_No, Model, Colour, Year, status, sellerIds } = req.body;
        const car = await Car.create({ IL_No, Mod_No, Model, Colour, Year, status });

        // Associate sellers (employees) via M:N
        if (sellerIds && Array.isArray(sellerIds)) {
            await car.setSellers(sellerIds);
        }

        const result = await Car.findByPk(car.Car_ID, {
            include: [{ model: Employee, as: 'sellers', through: { attributes: [] } }]
        });
        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating car:', error);
        res.status(400).json({ error: error.message || 'Failed to create car' });
    }
});

// PUT update car
router.put('/:id', async (req, res) => {
    try {
        const car = await Car.findByPk(req.params.id);
        if (!car) return res.status(404).json({ error: 'Car not found' });

        const { IL_No, Mod_No, Model, Colour, Year, status, sellerIds } = req.body;
        await car.update({ IL_No, Mod_No, Model, Colour, Year, status });

        if (sellerIds && Array.isArray(sellerIds)) {
            await car.setSellers(sellerIds);
        }

        const result = await Car.findByPk(car.Car_ID, {
            include: [{ model: Employee, as: 'sellers', through: { attributes: [] } }]
        });
        res.json(result);
    } catch (error) {
        console.error('Error updating car:', error);
        res.status(400).json({ error: 'Failed to update car' });
    }
});

// DELETE car
router.delete('/:id', async (req, res) => {
    try {
        const car = await Car.findByPk(req.params.id);
        if (!car) return res.status(404).json({ error: 'Car not found' });
        await car.setSellers([]);
        await car.destroy();
        res.json({ message: 'Car deleted successfully' });
    } catch (error) {
        console.error('Error deleting car:', error);
        res.status(500).json({ error: 'Failed to delete car' });
    }
});

module.exports = router;
