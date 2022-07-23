import React, { useState, useEffect } from "react";
import "./App.css";
// import Web3 from "web3";

import { Header } from "./components/index";
import { walletContext, collectionContext } from "./context/index";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import {
  CreateCollection,
  CreateTable,
  HomePage,
  CollectionDetail,
} from "./pages/index";
import { db } from "./firebase/config";
import { getDatabase, child, set, get, onValue, ref } from "firebase/database";
import web3 from "./web3/index";
import dropCollectionAbi from "./abi/dropCollection.json";

// import Web3 from "web3";

// import firebaseConfig from "./firebase/config";
// import nftcJson from "./abi/nftc.json";

function App() {
  const [userWallet, setUserWallet] = useState();
  const [collectionData, setCollectionData] = useState({});

  // const [account, setAccount] = useState();
  // const [web3, setWeb3Instance] = useState();
  // const [contract, setContract] = useState();

  useEffect(() => {
    async function load() {
      try {
        onValue(ref(db, "collections/"), (snapshot) => {
          const data = snapshot.val();
          setCollectionData(data);
        });
      } catch (e) {
        console.log(e);
      }

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
  }, []);

  return (
    <walletContext.Provider value={{ userWallet, setUserWallet }}>
      <collectionContext.Provider value={{ collectionData, setCollectionData }}>
        <BrowserRouter>
          <Header>
            <Routes>
              <Route path="/create-collection" element={<CreateCollection />} />
              <Route path="/create-table" element={<CreateTable />} />
              <Route path="/home" element={<HomePage />} />
              <Route
                path="/collection/:collectionId"
                element={<CollectionDetail />}
              />
              <Route path="/*" element={<Navigate to="/home" />} />
            </Routes>
          </Header>
        </BrowserRouter>
      </collectionContext.Provider>
    </walletContext.Provider>
  );
}

export default App;
