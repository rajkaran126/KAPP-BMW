const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Customer = sequelize.define('Customer', {
    Cus_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'Cus_ID'
    },
    Name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    Ph_No: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    Address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    City: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    Country: {
        type: DataTypes.STRING(100),
        allowNull: true
    }
}, {
    tableName: 'Customers',
    timestamps: true
});

module.exports = Customer;
