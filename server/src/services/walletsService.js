const walletsModel = require("../models/wallets");
const utils = require("../utils/utils");

const find = async (id) => {
  const response = await walletsModel.findOrCreate({ 
    where: { id }, 
    defaults: { nonce: utils.getRandomNonce() },
  });
  const [ wallet, created ] = response;
  return wallet.get({ plain: true });
}

const refresh = async (id) => {
  const wallet = await walletsModel.findByPk(id);
  if (wallet === null)
    throw new Error("Wallet not found");
  wallet.nonce = utils.getRandomNonce();
  await wallet.save();
}

module.exports = {
  find,
  refresh,
};
