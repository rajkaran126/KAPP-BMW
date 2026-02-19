const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EmployeeQualification = sequelize.define('EmployeeQualification', {
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
    qualification: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    tableName: 'EmployeeQualifications',
    timestamps: false
});

module.exports = EmployeeQualification;
