import { useState, useEffect } from "react";
import { Tabs, Tab } from "react-bootstrap";
import Web3 from "web3";
import Navbar from "./Navbar";
import Bank from "../abis/Bank.json";

export default function App() {
  const [web3, setWeb3] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState({});
  const [balanceBNB, setBalanceBNB] = useState(0);
  const [balanceContract, setBalanceContract] = useState(0);
  const [rate, setRate] = useState(0);
  const [amount, setAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [addressReceiver, setAddressReceiver] = useState("");
  const [minter, setMinter] = useState("");
  const [inputRate, setInputRate] = useState("");

  useEffect(() => {
    async function loadWeb3andContract() {
      try {
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

        const networkId = await web3.eth.net.getId();
        const networkData = Bank.networks[networkId];

        const balanceContract = await web3.eth.getBalance(
          networkData.address
        );
        setBalanceContract(web3.utils.fromWei(balanceContract, "ether"));

        // --------------- CONTRACT ----------------
        const contract = await new web3.eth.Contract(
          Bank.abi,
          networkData.address
        );

        console.log(contract);
        setContract(contract);

        //const balanceToken = await contract.methods.balanceOfTokens(accounts[0]).call();

        //setBalanceToken(web3.utils.fromWei(balanceToken, "ether"));

        const rate = await contract.methods.rate().call();
        setRate(rate);

        // MINTER
        const minter = await contract.methods.minter().call();
        setMinter(minter);

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
        setError(`Ha ocurrido un error: ${error.message}`);
      }
    }
    loadWeb3andContract();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("amount", amount);
      setIsLoading(true);
      await contract.methods.buyTokens().send({
        value: web3.utils.toWei(amount.toString(), "ether"),
        from: accounts[0],
        gas: 3000000,
      });
      setIsLoading(false);
      setError(``);
      setSuccess("Se ha realizado la transaccion de manera exitosa.");
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      setSuccess("");
      setError(`Ha ocurrido un error: ${error.message}`);
    }
  };

  const handleSubmitWithdraw = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      await contract.methods.withdraw(addressReceiver, web3.utils.toWei(amount.toString(), "ether")).send({
        from: accounts[0],
        gas : '3000000'
      });

      setIsLoading(false);
      setError(``);
      setSuccess("Se ha realizado la transaccion de manera exitosa.");
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      setSuccess("");
      setError(`Ha ocurrido un error: ${error.message}`);
    }
  };

  const handleSubmitChangeMinter = async(e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await contract.methods.changeMinterAddress(addressReceiver).send({
        from: accounts[0],
        gas : '3000000'
      });
      setIsLoading(false);
      setError(``);
      setSuccess("Se ha realizado la transaccion de manera exitosa.");
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      setSuccess("");
      setError(`Ha ocurrido un error: ${error.message}`);
    }
  }

  const handleSubmitChangeRate = async(e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await contract.methods.setRate(inputRate).send({
        from: accounts[0],
        gas : '3000000'
      });
      setIsLoading(false);
      setError(``);
      setSuccess("Se ha realizado la transaccion de manera exitosa.");
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      setSuccess("");
      setError(`Ha ocurrido un error: ${error.message}`);
    }
    
  } 

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-5 mx-auto">
            {!isLoading ? (
              <div className="row">
                {error !== "" ? (
                  <div className="alert alert-warning">{error}</div>
                ) : (
                  ""
                )}
                {success !== "" ? (
                  <div className="alert alert-success">{success}</div>
                ) : (
                  ""
                )}
                <main role="main" className="text-center">
                  <div className="content mr-auto ml-auto">
                    <Tabs defaultActiveKey="buy" id="uncontrolled-tab-example">
                      <Tab eventKey="buy" title="Comprar Token [CPRP]">
                        <div className="pt-2">
                          <form onSubmit={handleSubmit}>
                            <div className="card">
                              <div className="card-header">
                                <h3>Comprar Token [CPRP]</h3>
                              </div>
                              <div className="card-body">
                                <div className="d-flex justify-content-between">
                                  <span className="fw-bold">Input</span>
                                  <span>
                                    Tu Balance: {balanceBNB} <b>BNB</b>
                                  </span>
                                </div>

                                <div className="form-group">
                                  <input
                                    onChange={(e) => {
                                      const amount = e.target.value * rate;
                                      document.getElementById(
                                        "tokenRate"
                                      ).innerHTML = amount;

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
                        </div>
                      </Tab>

                      {minter == accounts[0] ? (
                        <Tab eventKey="withdraw" title="Retirar fondos BNB">
                          <div className="pt-3">
                            <form onSubmit={handleSubmitWithdraw}>
                              <div className="card">
                                <div className="card-header">
                                  <h3>Deseas retirar BNB?</h3>
                                </div>
                                <div className="card-body">
                                  <div className="d-flex justify-content-between">
                                    <span className="fw-bold">Input</span>
                                    <span>
                                      Balance del Contrato: {balanceContract}{" "}
                                      <b>BNB</b>
                                    </span>
                                  </div>

                                  <div className="form-group">
                                    <input
                                      onChange={(e) => {
                                        setAmount(e.target.value);
                                      }}
                                      id="amountBNBtoWithdraw"
                                      required
                                      step="0.01"
                                      min="0.01"
                                      type="number"
                                      placeholder="Introduzca la cantidad de BNB a retirar"
                                      className="form-control"
                                    ></input>
                                  </div>

                                  <div className="form-group">
                                    <input
                                      onChange={(e) => {
                                        setAddressReceiver(e.target.value);
                                      }}
                                      id="addressReceiver"
                                      required
                                      type="text"
                                      placeholder="Introduzca la direccion (address) del beneficiario"
                                      className="form-control mt-2"
                                    ></input>
                                  </div>
                                </div>
                                <div className="card-footer">
                                  <div className="d-grid gap-2">
                                    <button
                                      type="submit"
                                      className="btn btn-primary fw-bold text-warning"
                                    >
                                      RETIRAR BNB
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>
                        </Tab>
                      ) : (
                        ""
                      )}



{minter == accounts[0] ? (
                        <Tab eventKey="changeminter" title="Sustituir Minter">
                          <div className="pt-3">
                            <form onSubmit={handleSubmitChangeMinter}>
                              <div className="card">
                                <div className="card-header">
                                  <h3>Sustituir Minter</h3>
                                </div>
                                <div className="card-body">
                                 

                                  <div className="form-group">
                                    <input
                                      onChange={(e) => {
                                        setAddressReceiver(e.target.value);
                                      }}
                                      id="addressReceiver"
                                      required
                                      type="text"
                                      placeholder="Introduzca la direccion (address) del nuevo minter"
                                      className="form-control mt-2"
                                    ></input>
                                  </div>
                                </div>
                                <div className="card-footer">
                                  <div className="d-grid gap-2">
                                    <button
                                      type="submit"
                                      className="btn btn-info fw-bold"
                                    >
                                      CAMBIAR MINTER
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>
                        </Tab>
                      ) : (
                        ""
                      )}


{minter == accounts[0] ? (
                        <Tab eventKey="changerate" title="Cambiar Rate">
                          <div className="pt-3">
                            <form onSubmit={handleSubmitChangeRate}>
                              <div className="card">
                                <div className="card-header">
                                  <h3>Cambiar Rate</h3>
                                </div>
                                <div className="card-body">
                                    Rate actual 1 BNB = {rate} CPRP
                                  <div className="form-group mt-2">
                                    <input
                                      onChange={(e) => {
                                        setInputRate(e.target.value);
                                      }}
                                      id="inputRate"
                                      required
                                      type="text"
                                      placeholder="Introduzca el nuevo rate"
                                      className="form-control mt-2"
                                    ></input>
                                  </div>
                                </div>
                                <div className="card-footer">
                                  <div className="d-grid gap-2">
                                    <button
                                      type="submit"
                                      className="btn btn-warning text-dark fw-bold"
                                    >
                                      CAMBIAR RATE
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>
                        </Tab>
                      ) : (
                        ""
                      )}


                    </Tabs>
                  </div>
                </main>
              </div>
            ) : (
              <div className="alert alert-info text-center"><b>Por favor espere...</b></div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
