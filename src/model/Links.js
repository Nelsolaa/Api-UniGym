const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/config'); 

const Link = sequelize.define('Link', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, 
  },
  user_id: {
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
        model: 'users', 
        key: 'id', 
      },
    onDelete: 'CASCADE',
  },
  title: {
    type: DataTypes.STRING, 
    allowNull: false,
  },
    url: {
        type: DataTypes.TEXT, 
        allowNull: false,
    },
}, {
  tableName: 'links',
  timestamps: false, 
});

module.exports = { Link };
