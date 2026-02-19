/**
 * One-time migration script: drops all old tables and recreates with new ER diagram schema.
 * Run once: node migrate.js
 * WARNING: This will DELETE all existing data.
 */
require('dotenv').config();
const sequelize = require('./config/database');

const Employee = require('./models/Employee');
const EmployeeQualification = require('./models/EmployeeQualification');
const Car = require('./models/Car');
const Customer = require('./models/Customer');
const Invoice = require('./models/Invoice');
const EmployeeCar = require('./models/EmployeeCar');

// Define associations (same as server.js)
Employee.hasMany(EmployeeQualification, { foreignKey: 'EmpID', as: 'qualifications' });
EmployeeQualification.belongsTo(Employee, { foreignKey: 'EmpID', as: 'employee' });

Employee.belongsToMany(Car, { through: EmployeeCar, foreignKey: 'EmpID', otherKey: 'Car_ID', as: 'soldCars' });
Car.belongsToMany(Employee, { through: EmployeeCar, foreignKey: 'Car_ID', otherKey: 'EmpID', as: 'sellers' });

Employee.hasMany(Invoice, { foreignKey: 'EmpID', as: 'invoices' });
Invoice.belongsTo(Employee, { foreignKey: 'EmpID', as: 'employee' });

Car.hasMany(Invoice, { foreignKey: 'Car_ID', as: 'invoices' });
Invoice.belongsTo(Car, { foreignKey: 'Car_ID', as: 'car' });

Customer.hasMany(Invoice, { foreignKey: 'Cus_ID', as: 'invoices' });
Invoice.belongsTo(Customer, { foreignKey: 'Cus_ID', as: 'customer' });

const migrate = async () => {
    try {
        console.log('⚠️  Dropping all tables and recreating with new ER diagram schema...');

        // Drop tables in correct order (respecting FK constraints)
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await sequelize.query('DROP TABLE IF EXISTS InvoiceLogs');
        await sequelize.query('DROP TABLE IF EXISTS Invoices');
        await sequelize.query('DROP TABLE IF EXISTS EmployeeCar');
        await sequelize.query('DROP TABLE IF EXISTS EmployeeQualifications');
        await sequelize.query('DROP TABLE IF EXISTS Cars');
        await sequelize.query('DROP TABLE IF EXISTS Customers');
        await sequelize.query('DROP TABLE IF EXISTS Employees');
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('✓ Old tables dropped');

        // Recreate with new schema
        await sequelize.sync({ force: false });
        console.log('✓ New tables created successfully');

        console.log('\n✅ Migration complete! You can now run: npm run dev\n');
        process.exit(0);
    } catch (error) {
        console.error('✗ Migration failed:', error.message);
        process.exit(1);
    }
};

migrate();
