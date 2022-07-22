import React, { useState, useEffect } from "react";
import "./App.css";
// import Web3 from "web3";
// import { MoralisProvider } from "react-moralis";

import { Header } from "./components/index";
import { walletContext } from "./context/index";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CreateCollection, CreateTable, UploadImages } from "./pages/index";

// import Web3 from "web3";
import { MoralisProvider, useMoralis } from "react-moralis";
// import firebaseConfig from "./firebase/config";
// import nftcJson from "./abi/nftc.json";

function App() {
  const {
    web3,
    enableWeb3,
    isWeb3Enabled,
    isWeb3EnableLoading,
    web3EnableError,
  } = useMoralis();

  const [userWallet, setUserWallet] = useState({});
  // const [account, setAccount] = useState();
  // const [web3, setWeb3Instance] = useState();
  // const [contract, setContract] = useState();

  useEffect(() => {
    async function load() {
      // const web3 = new Web3(MoralisProvider.);
      //   Web3.givenProvider(
      //     "https://mainnet.infura.io/v3/ZiPX0JtXnVqQ56RGdvdy8mvCOs4ZDchO"
      //   )
      // );
      // console.log(web3);
      // setWeb3Instance(web3);
      // const accounts = await web3.eth.requestAccounts();
      // const contract = new Web3.eth.Contract(
      //   nftcJson,
      //   "0xd8Ad6001551Ced68c536De41F18C575185d49738"
      // );
      // setContract(contract);
      // setAccount(accounts[0]);
    }
    load();
    enableWeb3();
  }, []);

  return (
    <walletContext.Provider value={{ userWallet, setUserWallet }}>
      <BrowserRouter>
        <Header>
          <Routes>
            <Route path="/create-collection" element={<CreateCollection />} />
            <Route path="/create-table" element={<CreateTable />} />
            <Route path="/upload-images/*" element={<UploadImages />} />
          </Routes>
        </Header>
      </BrowserRouter>
    </walletContext.Provider>
  );
}

export default App;
