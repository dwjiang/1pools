const commentsModel = require("../models/comments");
const walletsService = require("./walletsService");

const findAll = async (pool) => {
  return await commentsModel.findAll({ where: { pool }, raw: true });
}

const create = async (pool, address, message) => {
  return await commentsModel.create({
    pool, address, content: message
  });
}

module.exports = {
  findAll,
  create,
};
