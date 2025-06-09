const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/config'); 

const Exercicio = sequelize.define('Exercicio', { 
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome_exercicio: {
    type: DataTypes.STRING, 
    allowNull: false,
  },
    descricao: {
    type: DataTypes.TEXT, 
    allowNull: false,      
  },
}, {
  tableName: 'exercicios',  
  timestamps: false,   
});

module.exports = { Exercicio }; // Exporta o modelo 'Exercicio'