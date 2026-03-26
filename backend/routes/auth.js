const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const user = await User.findOne({ where: { username } });

        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // In a real app, generate JWT here. For now, returning user info.
        res.json({
            UserID: user.UserID,
            username: user.username,
            name: user.name,
            role: user.role,
            avatar: user.avatar
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login. Please ensure the backend is running.' });
    }
});

// Signup
router.post('/signup', async (req, res) => {
    try {
        const { username, password, name, role } = req.body;

        const existing = await User.findOne({ where: { username } });
        if (existing) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const newUser = await User.create({
            username,
            password, // Note: Should hash in production
            name,
            role: role || 'Staff'
        });

        res.status(201).json({
            UserID: newUser.UserID,
            username: newUser.username,
            name: newUser.name,
            role: newUser.role
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Profile
router.put('/:id', async (req, res) => {
    try {
        const { name, avatar } = req.body;
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (name) user.name = name;
        if (avatar !== undefined) user.avatar = avatar; // Allow clearing avatar

        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
