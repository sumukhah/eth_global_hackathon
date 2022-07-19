import React, { useState } from "react";
import "./App.css";

import { Header } from "./components/index";
import { walletContext } from "./context/index";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CreateCollection } from "./pages/index";
import firebaseConfig from "./firebase/config";

function App() {
  const [userWallet, setUserWallet] = useState({});
  return (
    <walletContext.Provider value={{ userWallet, setUserWallet }}>
      <BrowserRouter>
        <Header>
          <Routes>
            <Route path="/create-collection" element={<CreateCollection />} />
          </Routes>
        </Header>
      </BrowserRouter>
    </walletContext.Provider>
  );
}

export default App;
