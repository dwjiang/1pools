const Sequelize = require("sequelize");

const credentials = require("./credentials");

let connection;

switch (process.env.NODE_ENV) {
  case "production":
    connection = new Sequelize(
      credentials.production.database,
      credentials.production.username,
      credentials.production.password,
      {
        host: credentials.production.host,
        dialect: credentials.production.dialect,
      }
    );
    break;
  default:
    connection = new Sequelize(
      credentials.development.database,
      credentials.development.username,
      credentials.development.password,
      {
        host: credentials.development.host,
        dialect: credentials.development.dialect,
      }
    );
}

module.exports = connection;
