const Sequelize = require("sequelize");
const connection = require("../../config/connection");

module.exports = 
  connection.define(
    "wallets",
    {
      id: {
        type: Sequelize.STRING(43),
        allowNull: false,
        primaryKey: true,
        field: "id",
      },
      nonce: {
        type: Sequelize.STRING(32),
        allowNull: false,
        field: "nonce",
      },
    },
    {
      timestamps: false,
      engine: "InnoDB",
      charset: "utf-8",
      tableName: "wallets",
    },
  );
