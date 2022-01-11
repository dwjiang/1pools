const updatesModel = require("../models/updates");
const utils = require("../utils/utils");

const findAll = async (pool) => {
  return await updatesModel.findAll({ where: { pool }, raw: true });
}

const create = async (pool, address, message) => {
  if (!(await utils.verifyOwner(address, pool)))
    throw new Error("Address is not an owner of this pool");
  return await updatesModel.create({
    pool, address, content: message
  });
}

module.exports = {
  findAll,
  create,
};
