const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/config'); // Ajuste o caminho para sua configuração do Sequelize

const FichaExercicio = sequelize.define('FichaExercicio', {
  // Coluna ficha_id: Chave Estrangeira e parte da Chave Primária Composta
  ficha_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true, // Indica que esta coluna faz parte da chave primária
    references: {
      model: 'fichas',     // Nome da tabela 'fichas'
      key: 'id',
    },
  },
  // Coluna exercicio_id: Chave Estrangeira e parte da Chave Primária Composta
  exercicio_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true, // Indica que esta coluna faz parte da chave primária
    references: {
      model: 'exercicios', // Nome da tabela 'exercicios'
      key: 'id',
    },
  },
  // Coluna series: Mapeia para 'series INTEGER NOT NULL CHECK (series > 0)'
  series: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1, // Garante que o valor seja maior que 0 (pois é inteiro)
    },
  },
  // Coluna tempo_descanso: Mapeia para 'tempo_descanso INTEGER NOT NULL CHECK (tempo_descanso >= 0)'
  tempo_descanso: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0, // Garante que o valor seja 0 ou maior
    },
  },
}, {
  tableName: 'ficha_exercicios', // Nome exato da tabela no banco de dados
  timestamps: false,           // Não cria as colunas createdAt e updatedAt
  // A chave primária composta (ficha_id, exercicio_id) é definida
  // marcando ambas as colunas com 'primaryKey: true'.
});

// IMPORTANTE: Associações Many-to-Many
// Este modelo FichaExercicio atuará como a tabela 'through' (intermediária)
// para a relação Muitos-para-Muitos entre Ficha e Exercicio.
// As definições de Ficha.belongsToMany(Exercicio, { through: FichaExercicio, ... })
// e Exercicio.belongsToMany(Ficha, { through: FichaExercicio, ... })
// devem ser feitas no seu arquivo src/model/index.js, após todos os modelos
// serem importados.

module.exports = { FichaExercicio };