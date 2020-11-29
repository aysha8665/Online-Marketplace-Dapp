const Administered = artifacts.require("Administered");

module.exports = function (deployer) {
  deployer.deploy(Administered);
};