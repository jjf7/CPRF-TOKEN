const Token = artifacts.require("Token");
const Bank = artifacts.require("Bank");

contract("Token", (accounts) => {
  describe("Token deployment", async () => {
    it("Contract has a name", async () => {
      console.log(accounts);
      const token = await Token.new();
      const name = await token.name();
      assert(name, "CoinPinverPhoenix");
    });
  });
});
