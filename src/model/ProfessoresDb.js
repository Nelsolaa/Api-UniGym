const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/config'); // Mantenha o caminho correto para sua config

const Professor = sequelize.define('Professor', { // Nome do Modelo (geralmente singular)
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING, // VARCHAR(255) é o padrão
    allowNull: false,
  },
  data_nascimento: {
    type: DataTypes.DATEONLY, // Ideal para campos DATE do SQL (apenas data)
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Garante a unicidade
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sexo: {
    type: DataTypes.STRING(50), // Define o tamanho para VARCHAR(50)
    allowNull: true, // Permite nulo, já que é opcional
  },
    tipo: {
    type: DataTypes.STRING(50)
  },
}, {
  tableName: 'professores',   // Nome exato da tabela no banco
  timestamps: false,   // Desabilita as colunas createdAt e updatedAt
});

module.exports = { Professor }; // Exporta o modelo 'Professor'