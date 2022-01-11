const { getPubkeyFromPrivateKey, toBech32 } = require("@harmony-js/crypto");
const { addHexPrefix, bufferToHex, ecrecover, fromRpcSig, hashPersonalMessage, pubToAddress } = require("ethereumjs-util");
const constants = require("../constants/constants");
const { Hmy } = require("@harmony-utils/wrappers");
const { PoolsABI } = require("../abi/Pools");
const crypto = require("crypto");

const harmony = new Hmy("testnet");

const getRandomNonce = () => {
  return crypto.randomBytes(16).toString("hex");
}

const verifySignature = (address, signedNonce, nonce) => {
  const sig = fromRpcSig(signedNonce);
  const publicKey = ecrecover(addHexPrefix(hashPersonalMessage(Buffer.from(nonce))), sig.v, sig.r, sig.s);
  const sigAddress = addHexPrefix(bufferToHex(pubToAddress(publicKey)));
  const hmyAddress = toBech32(sigAddress);
  return hmyAddress === address;
}

const verifyOwner = async (address, pool) => {
  const contract = await harmony.client.contracts.createContract(PoolsABI, pool);
  return (await contract.methods.getOwners().call()).some(owner => owner === address);
}

module.exports = {
  getRandomNonce,
  verifySignature,
  verifyOwner,
};
