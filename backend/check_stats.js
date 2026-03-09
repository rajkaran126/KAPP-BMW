require('dotenv').config();
const sequelize = require('./config/database');
const Employee = require('./models/Employee');
const Car = require('./models/Car');
const Customer = require('./models/Customer');
const Invoice = require('./models/Invoice');

async function checkStats() {
    try {
        await sequelize.authenticate();
        console.log('✓ Connected to Database');

        const empCount = await Employee.count();
        const carCount = await Car.count();
        const custCount = await Customer.count();
        const invCount = await Invoice.count();

        console.log('\n─── Database Statistics ───');
        console.log(`Employees: ${empCount}`);
        console.log(`Cars:      ${carCount}`);
        console.log(`Customers: ${custCount}`);
        console.log(`Invoices:  ${invCount}`);
        console.log('───────────────────────────\n');

        // List recent entries if any
        if (empCount > 0) {
            const recentEmp = await Employee.findOne({ order: [['createdAt', 'DESC']] });
            console.log('Most recent Employee:', recentEmp.Name);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error querying database:', error);
        process.exit(1);
    }
}

checkStats();
