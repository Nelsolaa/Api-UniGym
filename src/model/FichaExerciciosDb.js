const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/config'); 

const FichaExercicio = sequelize.define('FichaExercicio', {

  ficha_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true, 
    references: {
      model: 'fichas',     
      key: 'id',
    },
  },

  exercicio_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true, 
    references: {
      model: 'exercicios', 
      key: 'id',
    },
  },

  series: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1, 
    },
  },
  
  tempo_descanso: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
}, {
  tableName: 'ficha_exercicios', 
  timestamps: false,          
});


module.exports = { FichaExercicio };