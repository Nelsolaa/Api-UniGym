const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/config'); // Certifique-se que o caminho está correto

const Aula = sequelize.define('Aula', {
  // id: Mapeia para 'id SERIAL PRIMARY KEY'
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // professor_id: Mapeia para 'professor_id INTEGER NOT NULL'
  professor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'professores', // Nome da tabela referenciada
      key: 'id',          // Coluna referenciada
    }
  },
  // aluno_id: Mapeia para 'aluno_id INTEGER NULL'
  aluno_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // Importante: Permite nulo (horário disponível)
    references: {
      model: 'alunos', // Nome da tabela referenciada
      key: 'id',       // Coluna referenciada
    }
  },
  // data_hora_inicio: Mapeia para 'TIMESTAMP NOT NULL'
  data_hora_inicio: {
    type: DataTypes.DATE, // Sequelize usa DATE para mapear TIMESTAMP
    allowNull: false,
  },
  // data_hora_fim: Mapeia para 'TIMESTAMP NOT NULL'
  data_hora_fim: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  // status: Mapeia para 'VARCHAR(50) NOT NULL DEFAULT 'Disponivel' CHECK...'
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'Disponivel', // Define o valor padrão
    validate: {
      isIn: [['Disponivel', 'Agendada']], // Garante que só esses valores entrem
    },
  },
}, {
  tableName: 'aulas', // Nome exato da tabela no banco
  timestamps: false,  // Não adiciona createdAt e updatedAt
});


module.exports = { Aula }; // Exporta o modelo Aula