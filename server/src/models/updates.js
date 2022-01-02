const Sequelize = require("sequelize");
const connection = require("../../config/connection");

module.exports = 
  connection.define(
    "updates",
    {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id",
      },
      pool: {
        type: Sequelize.STRING(43),
        allowNull: false,
        field: "pool",
      },
      address: {
        type: Sequelize.STRING(43),
        allowNull: false,
        field: "address",
      },
      content: {
        type: Sequelize.STRING(1000),
        allowNull: false,
        field: "content",
      },
      createdAt: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
        field: "createdAt",
      },
    },
    {
      timestamps: false,
      engine: "InnoDB",
      charset: "utf-8",
      tableName: "updates",
    },
  );
