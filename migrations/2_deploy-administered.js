const Administered = artifacts.require("./Administered.sol");

module.exports = function (deployer) {
  deployer.deploy(Administered);
};