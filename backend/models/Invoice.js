const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Invoice = sequelize.define('Invoice', {
    Invoice_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'Invoice_ID'
    },
    Date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
        comment: 'Sale amount (not in ER diagram but essential for sales)'
    },
    EmpID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Employees',
            key: 'EmpID'
        }
    },
    Car_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Cars',
            key: 'Car_ID'
        }
    },
    Cus_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Customers',
            key: 'Cus_ID'
        }
    }
}, {
    tableName: 'Invoices',
    timestamps: true
});

module.exports = Invoice;
