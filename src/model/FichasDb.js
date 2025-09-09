const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/config');

const Ficha = sequelize.define('Ficha', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  grupo_muscular: {
    type: DataTypes.STRING(100), 
    allowNull: false,
    unique: true 
  },
}, {
  tableName: 'fichas', 
  timestamps: false,  
});

module.exports = { Ficha }; 