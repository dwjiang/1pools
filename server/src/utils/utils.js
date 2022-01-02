const { getPubkeyFromPrivateKey, toBech32 } = require("@harmony-js/crypto");
const { addHexPrefix, bufferToHex, ecrecover, fromRpcSig, hashPersonalMessage, pubToAddress } = require("ethereumjs-util")
const crypto = require("crypto");

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

module.exports = {
  getRandomNonce,
  verifySignature,
};
