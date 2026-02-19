const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EmployeeCar = sequelize.define('EmployeeCar', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
    }
}, {
    tableName: 'EmployeeCar',
    timestamps: false
});

module.exports = EmployeeCar;
