const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/config");

const User = sequelize.define(
  "User",
  {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, 
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  { tableName: "users", timestamps: false }
);

module.exports = { User };