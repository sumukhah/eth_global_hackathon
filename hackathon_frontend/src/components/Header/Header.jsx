import React, { useContext, useEffect } from "react";
import { WalletOutlined } from "@ant-design/icons";
import "./Header.css";
import { Button, Tooltip } from "antd";

import { walletContext } from "../../context";
import { Link } from "react-router-dom";

export default function Header(props) {
  const { userWallet, setUserWallet } = useContext(walletContext);
  useEffect(() => {
    authenticateUser();
  }, []);

  const authenticateUser = async () => {
    // if (isAuthenticated) {
    //   await logout();
    //   setUserWallet({});
    //   return;
    // } else {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log(accounts, "accounts");

    setUserWallet(accounts[0]);
    // }
  };
  return (
    <div className="page-container">
      <div className="header-container">
        <div>
          <span>icon</span>
          <span></span>
        </div>
        <div className="right-header-section">
          <Link to="/create-collection">Create collection</Link>
          <Button
            type="primary"
            icon={<WalletOutlined />}
            size="large"
            className="wallet-button"
            onClick={authenticateUser}
          >
            {userWallet
              ? userWallet.slice(0, 4) + "..." + userWallet.slice(-4)
              : "Login"}
          </Button>
        </div>
      </div>
      <div className="content-container">{props.children}</div>
    </div>
  );
}
