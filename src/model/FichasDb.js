const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/config'); // Certifique-se que o caminho está correto

const Ficha = sequelize.define('Ficha', {
  // id: Mapeia para 'id SERIAL PRIMARY KEY'
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // professor_id: Mapeia para 'professor_id INTEGER NOT NULL'
  grupo_muscular: {
    type: DataTypes.STRING(100), // VARCHAR(100) para o grupo muscular
    allowNull: false,
    unique: true 
  },
}, {
  tableName: 'fichas', // Nome exato da tabela no banco
  timestamps: false,  // Não adiciona createdAt e updatedAt
});

module.exports = { Ficha }; // Exporta o modelo Ficha