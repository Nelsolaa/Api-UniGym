const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/config'); 

const Aula = sequelize.define('Aula', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  professor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'professores',
      key: 'id',
    }
  },
  aluno_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'alunos',
      key: 'id',
    }
  },
  data_hora_inicio: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  data_hora_fim: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'Disponivel',
    validate: {
      isIn: [['Disponivel', 'Agendada']],
    },
  },
}, {
  tableName: 'aulas',
  timestamps: false,
});


module.exports = { Aula };