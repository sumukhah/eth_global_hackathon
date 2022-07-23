import React, { useState, useEffect } from "react";
import { connect } from "@tableland/sdk";

const useTableLandConnection = () => {
  const initializeTableland = async () => {
    const tableland = await connect({
      network: "testnet",
      chain: "polygon-mumbai",
    });
    return tableland;
  };

  return { initializeTableland };
};

export default useTableLandConnection;
