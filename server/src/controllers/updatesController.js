const updatesService = require("../services/updatesService");
const walletsService = require("../services/walletsService");
const utils = require("../utils/utils");

const findAll = async (req, res) => {
  const { pool } = req.params;
  const response = await updatesService.findAll(pool);
  res.status(200).json(response);
}

const create = async (req, res) => {
  const { pool } = req.params;
  const { signature, message, address } = req.query;
  const nonce = (await walletsService.find(address)).nonce;
  if (!utils.verifySignature(address, signature, nonce))
    throw new Error("Invalid signature provided");
  await walletsService.refresh(address);
  const update = updatesService.create(pool, address, message);
  if (update === null)
    throw new Error("Error creating update");
  res.sendStatus(200);
}

module.exports = {
  findAll,
  create,
};
