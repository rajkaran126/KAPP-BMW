const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const sequelize = require('./config/database');

// Import models
const Employee = require('./models/Employee');
const EmployeeQualification = require('./models/EmployeeQualification');
const Car = require('./models/Car');
const Customer = require('./models/Customer');
const Invoice = require('./models/Invoice');
const EmployeeCar = require('./models/EmployeeCar');
const User = require('./models/User'); // User model for Auth

// ─── Define Associations ───────────────────────────────────────────────────────

// Employee ↔ Qualification (1:N)
Employee.hasMany(EmployeeQualification, { foreignKey: 'EmpID', as: 'qualifications' });
EmployeeQualification.belongsTo(Employee, { foreignKey: 'EmpID', as: 'employee' });

// Employee ↔ Car via SELLS (M:N)
Employee.belongsToMany(Car, {
    through: EmployeeCar,
    foreignKey: 'EmpID',
    otherKey: 'Car_ID',
    as: 'soldCars'
});
Car.belongsToMany(Employee, {
    through: EmployeeCar,
    foreignKey: 'Car_ID',
    otherKey: 'EmpID',
    as: 'sellers'
});

// Employee → Invoice (1:N) — HAS
Employee.hasMany(Invoice, { foreignKey: 'EmpID', as: 'invoices' });
Invoice.belongsTo(Employee, { foreignKey: 'EmpID', as: 'employee' });

// Car → Invoice (1:N) — HAS
Car.hasMany(Invoice, { foreignKey: 'Car_ID', as: 'invoices' });
Invoice.belongsTo(Car, { foreignKey: 'Car_ID', as: 'car' });

// Customer → Invoice (1:N) — HAS
Customer.hasMany(Invoice, { foreignKey: 'Cus_ID', as: 'invoices' });
Invoice.belongsTo(Customer, { foreignKey: 'Cus_ID', as: 'customer' });

// ─── Express App ───────────────────────────────────────────────────────────────

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────────────────────

const employeeRoutes = require('./routes/employees');
const carRoutes = require('./routes/cars');
const customerRoutes = require('./routes/customers');
const invoiceRoutes = require('./routes/invoices');
const chatRoutes = require('./routes/chat');
const reportRoutes = require('./routes/reports');
const analyticsRoutes = require('./routes/analytics');

app.use('/api/employees', employeeRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reports', reportRoutes); // cursor-based stored procedures
app.use('/api/analytics', analyticsRoutes); // AI-powered analytics
app.use('/api/auth', require('./routes/auth')); // Authentication routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'KAPP-BMW Backend is running',
        version: '2.0.0',
        schema: 'ER Diagram v1 (Employee, Car, Customer, Invoice)'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────

const startServer = async () => {
    try {
        // Sync all models — alter:true updates existing tables without dropping data
        // Sync all models — avoiding alter: true to prevent startup crashes on existing tables
        await sequelize.sync();
        console.log('✓ Database synchronized');

        app.listen(PORT, () => {
            console.log(`\n========================================`);
            console.log(`  KAPP-BMW Backend Server v2.0`);
            console.log(`========================================`);
            console.log(`  Server running on port ${PORT}`);
            console.log(`  http://localhost:${PORT}`);
            console.log(`  Schema: ER Diagram (Employee/Car/Customer/Invoice)`);
            console.log(`========================================\n`);
        });
    } catch (error) {
        console.error('✗ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
