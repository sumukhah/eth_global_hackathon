import React, { useEffect, useState } from "react";
import { connect } from "@tableland/sdk";
import waitForTx from "./util";

const useCreateTable = () => {
  // const [balance, setBalance] = useState({ inWei: 0, formatted: 0 });

  const [tableConfig, setTableConfig] = useState({
    mainTableName: "",
    attributeTableName: "",
  });
  const [tableland, setTableland] = useState(null);

  useEffect(() => {
    const connectTableLand = async () => {
      const tableland = await connect({
        network: "testnet",
        chain: "polygon-mumbai",
      });
      console.log(tableland, "is tableland");
      setTableland(tableland);
    };
    connectTableLand();
  }, []);

  debugger;
  // Define the table's schema
  const mainSchema = `id int, name text, description text, image text, primary key (id)`;
  // Should have one `main` row (a token) to many `attributes`, so no need to introduce a primary key constraint
  const attributesSchema = `id int, trait_type text, value text`;
  // Define the (optional) prefix, noting the main & attributes tables
  // const mainPrefix = "table_nft_main";
  // const attributesPrefix = "table_nft_attributes";
  // const obj = {};
  // Create the main table and retrieve its returned `name` and on-chain tx as `txnHash`

  const createMainTable = async (mainPrefix) => {
    const { name: mainName, txnHash: mainTxnHash } = await tableland.create(
      mainSchema,
      mainPrefix
    );
    // Wait for the main table to be "officially" created (i.e., tx is included in a block)
    // If you do not, you could be later be inserting into a non-existent table
    let tableIsCreated = waitForTx(tableland, mainTxnHash);
    if (tableIsCreated) {
      console.log(
        `Table '${mainName}' has been created at tx '${mainTxnHash}'`
      );
      return { mainTableName: mainName, mainTableHash: mainTxnHash };
    } else {
      throw new Error(
        `Create table error: could not get '${mainName}' transaction receipt: ${mainTxnHash}`
      );
    }
  };

  const createAttributeTable = async (attributesPrefix) => {
    const { name: attributesName, txnHash: attributesTxnHash } =
      await tableland.create(attributesSchema, attributesPrefix);
    // Wait for the attributes table to be "officially" created (i.e., tx is included in a block)
    // If you do not, you could be later be inserting into a non-existent table
    let tableIsCreated = waitForTx(tableland, attributesTxnHash);
    if (tableIsCreated) {
      console.log(
        `Table '${attributesName}' has been created at tx '${attributesTxnHash}'`
      );
      return {
        attributeTableName: attributesName,
        attributeTableHash: attributesTxnHash,
      };
    } else {
      throw new Error(
        `Create table error: could not get '${attributesName}' transaction receipt: ${attributesTxnHash}`
      );
    }
  };

  return {
    createMainTable,
    createAttributeTable,
    tableConfig,
    tableland,
  };
};

export default useCreateTable;
