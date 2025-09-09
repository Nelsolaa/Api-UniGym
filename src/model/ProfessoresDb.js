const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/config');

const Professor = sequelize.define('Professor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING, 
    allowNull: false,
  },
  data_nascimento: {
    type: DataTypes.DATEONLY, 
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, 
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sexo: {
    type: DataTypes.STRING(50), 
    allowNull: true, 
  },
    tipo: {
    type: DataTypes.STRING(50)
  },
}, {
  tableName: 'professores',   
  timestamps: false,   
});

module.exports = { Professor }; 