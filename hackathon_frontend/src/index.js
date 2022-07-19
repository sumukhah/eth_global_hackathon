import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "antd/dist/antd.variable.min.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ConfigProvider } from "antd";
import { MoralisProvider } from "react-moralis";

ConfigProvider.config({
  theme: {
    primaryColor: "#202020",
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <MoralisProvider
      appId="LnkwfCJMIhZJtvpLBR9BnlzVU48NMhOs20FP4epF"
      serverUrl="https://ikimg4jikowe.usemoralis.com:2053/server"
    >
      <App />
    </MoralisProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
