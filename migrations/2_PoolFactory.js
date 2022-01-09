const Migrations = artifacts.require("PoolFactory");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
};