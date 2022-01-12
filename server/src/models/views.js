const Sequelize = require("sequelize");
const connection = require("../../config/connection");

module.exports = 
  connection.define(
    "views",
    {
      pool: {
        type: Sequelize.STRING(43),
        allowNull: false,
        primaryKey: true,
        field: "pool",
      },
      timestamp: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        field: "timestamp",
      },
      count: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        field: "count",
      }
    },
    {
      timestamps: false,
      engine: "InnoDB",
      charset: "utf-8",
      tableName: "views",
    },
  );
