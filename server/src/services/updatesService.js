const updatesModel = require("../models/updates");

const findAll = async (pool) => {
  return await updatesModel.findAll({ where: { pool }, raw: true });
}

const create = async (pool, address, message) => {
  return await updatesModel.create({
    pool, address, content: message
  });
}

module.exports = {
  findAll,
  create,
};
