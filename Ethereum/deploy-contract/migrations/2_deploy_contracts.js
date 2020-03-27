const BeomsToken = artifacts.require('./BeomsToken.sol');

module.exports = function(deployer) {
  deployer.deploy(BeomsToken);
}