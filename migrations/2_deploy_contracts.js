const Token = artifacts.require("Token");
const Bank = artifacts.require("Bank");

module.exports = async function (deployer, network, accounts) {
 
  try {
    
    await deployer.deploy(Token, { from: account[4] });
    const token = await Token.deployed();

    await deployer.deploy(Bank, token.address, { from: account[4] });
    const bank = await Bank.deployed();

    await token.transfer(bank.address, web3.utils.toWei("500000000", "ether"));
  } catch (error) {
    console.log('errorerrorerror',error);
  }
};
