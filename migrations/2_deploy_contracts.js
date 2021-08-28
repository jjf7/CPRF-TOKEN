const Token = artifacts.require("Token");
const Bank = artifacts.require("Bank");

module.exports = async function (deployer, network, accounts) {
  if (network == "testnet") {

    console.log(accounts)

    await deployer.deploy(Token);

    const token = await Token.deployed();

    await deployer.deploy(Bank, token.address);

    const bank = await Bank.deployed();

    await token.transfer(bank.address, web3.utils.toWei("500000000", "ether"));
  }
};
