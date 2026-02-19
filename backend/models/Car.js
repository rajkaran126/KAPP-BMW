const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Car = sequelize.define('Car', {
    Car_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'Car_ID'
    },
    IL_No: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Insurance/License Number'
    },
    Mod_No: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Model Number'
    },
    Model: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    Colour: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    Year: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('available', 'sold'),
        defaultValue: 'available'
    }
}, {
    tableName: 'Cars',
    timestamps: true
});

module.exports = Car;
