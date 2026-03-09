const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Employee = sequelize.define('Employee', {
    EmpID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'EmpID'
    },
    Name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    Address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    designation: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'Employees',
    timestamps: true
});

module.exports = Employee;
