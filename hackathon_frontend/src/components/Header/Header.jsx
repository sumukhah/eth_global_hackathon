import React, { useContext } from "react";
import { WalletOutlined } from "@ant-design/icons";
import "./Header.css";
import { Button, Tooltip } from "antd";
import { useMoralis } from "react-moralis";
import { walletContext } from "../../context";
import { Link } from "react-router-dom";

export default function Header(props) {
  const { authenticate, isAuthenticated, user, logout } = useMoralis();
  const { userWallet, setUserWallet } = useContext(walletContext);

  const authenticateUser = async () => {
    if (isAuthenticated) {
      await logout();
      setUserWallet({});
      return;
    }
    await authenticate();
    setUserWallet(user);
  };
  return (
    <div>
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
            {isAuthenticated
              ? user.get("ethAddress").slice(0, 4) +
                "..." +
                user.get("ethAddress").slice(-4)
              : "Login"}
          </Button>
        </div>
      </div>
      <div className="content-container">{props.children}</div>
    </div>
  );
}
