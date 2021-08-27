import { useState, useEffect } from "react";
import Web3 from "web3";
import Navbar from "./Navbar";
import Bank from "../abis/Bank.json";

export default function App() {
  const [web3, setWeb3] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState({});
  const [balanceBNB, setBalanceBNB] = useState(0);
  const [balanceToken, setBalanceToken] = useState(0);
  const [rate, setRate] = useState(0);
  const [amount, setAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadWeb3andContract() {
      setIsLoading(true);
      let web3;
      if (typeof window.ethereum !== "undefined") {
        window.ethereum.request({ method: "eth_requestAccounts" });
        web3 = new Web3(window.ethereum);
      } else {
        window.alert("Please install Metamask");
      }

      setWeb3(web3);
      const accounts = await web3.eth.getAccounts();
      // console.log(accounts[0]);
      setAccounts(accounts);

      const balanceBNB = await web3.eth.getBalance(accounts[0]);
      console.log("balanceBNB", balanceBNB);
      setBalanceBNB(web3.utils.fromWei(balanceBNB, "ether"));

      // --------------- CONTRACT ----------------
      const contract = await new web3.eth.Contract(
        Bank.abi,
        "0x31d89fCfC455e500A656D80a684a47e55B68B9E2"
      );

      console.log(contract);
      setContract(contract);

      //const balanceToken = await contract.methods.balanceOfTokens(accounts[0]).call();

      //setBalanceToken(web3.utils.fromWei(balanceToken, "ether"));

      const rate = await contract.methods.rate().call();
      setRate(rate);
      setIsLoading(false);
    }
    loadWeb3andContract();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('amount',amount);
    setIsLoading(true);
    try {
        await contract.methods
      .buyTokens()
      .send({ value: web3.utils.toWei(amount.toString(), "ether"), from: accounts[0], gas : 3000000 })
      .on("transactionHash", (hash) => {
        setIsLoading(false);
        window.alert("Transaccion exitosa");
        window.location.reload();
      });
    } catch (error) {
        console.log(error)
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-5 mx-auto">
            {!isLoading ? (
              <form onSubmit={handleSubmit}>
                <div className="card">
                  <div className="card-header">
                    <h3>Comprar Token [CPRP]</h3>
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <span className="fw-bold">Input</span>
                      <span>
                        Balance: {balanceBNB} <b>BNB</b>
                      </span>
                    </div>

                    <div className="form-group">
                      <input
                        onChange={(e) => {
                          const amount = e.target.value * rate;
                          document.getElementById("tokenRate").innerHTML =
                            amount;

                          setAmount(e.target.value);
                        }}
                        id="amountTokensToBuy"
                        required
                        step="0.01"
                        min="0.01"
                        type="number"
                        placeholder="Introduzca la cantidad de BNB"
                        className="form-control"
                      ></input>
                    </div>

                    <div className="d-flex justify-content-between mt-3">
                      <span className="">Exchange rate</span>
                      <span>1 BNB = {rate} tokens</span>
                    </div>
                  </div>
                  <div className="card-footer">
                    <div className="d-grid gap-2">
                      <button
                        type="submit"
                        className="btn btn-dark fw-bold text-warning"
                      >
                        COMPRAR <span id="tokenRate"></span> CPRP
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <h3>Cargando ...</h3>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
