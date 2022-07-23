import React, { useContext, useState } from "react";
import "./CreateTable.css";

import { Button, Form, Input, Upload, Typography, Alert, message } from "antd";
import useCreateTable from "../../hooks/useCreateTable";
import { InboxOutlined } from "@ant-design/icons";
import firebase from "../../firebase/config";
import { walletContext } from "../../context/index";
import { useLocation } from "react-router-dom";
import prepareSqlStatement from "../../utils/prepareSqlStatement";
import writeTable from "../../utils/writeTable";
import { db } from "../../firebase/config";
import { getDatabase, ref, set } from "firebase/database";
import web3 from "../../web3";
import dropCollectionAbi from "../../abi/dropCollection.json";
import Confetti from "react-confetti";
// import useWindowSize from "react-use/lib/useWindowSize";

// import nftContract from "../../web3/nftContract.js";
import { create } from "ipfs-http-client";

// import {
//   useMoralisWeb3Api,
//   useMoralisWeb3ApiCall,
//   useWeb3Contract,
//   useApiContract,
//   useWeb3ExecuteFunction,
// } from "react-moralis";

import nftAbi from "../../abi/nftc.json";
import useNftContract from "../../hooks/useNftContract";
import axios from "axios";

const client = create("https://ipfs.infura.io:5001/api/v0");
const { Dragger } = Upload;
const { Title } = Typography;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};

export default function CreateTable() {
  const {
    createAttributeTable,
    createMainTable,
    initiateTableLand,
    tableConfig,
  } = useCreateTable();
  const { userWallet } = useContext(walletContext);
  const location = useLocation();
  const { collectionAddress } = location.state || {
    collectionAddress: "0x861c61e5ed8ab04fdccc1e400c372def24cf3dda",
  };
  const [collectionContract, setCollectionContract] = useState(null);
  const [tableNames, setTableNames] = useState({
    mainTable: "",
    attributeTable: "",
  });
  const [minted, setMinted] = useState([false, ""]);
  const [nftData, setNftData] = useState({ images: [], metadata: [] });

  // const options = {
  //   abi: nftAbi,
  //   contractAddress: process.env.REACT_APP_NFTC_PROXY_ADDRESS,
  //   functionName: "createDropCollection",
  //   function_name: "createDropCollection",
  //   chain: "mumbai",
  //   params: {
  //     name: "FD",
  //     symbol: "GD",
  //     treasury: "0x464e3f471628e162fa34f130f4c3bcc41ff7635d",
  //     royalty: "0x464e3f471628e162fa34f130f4c3bcc41ff7635d",
  //     royaltyFee: 1,
  //   },
  // };

  // const { data, error, fetch, isFetching, isLoading, setData } =
  //   useWeb3ExecuteFunction(options);
  // const { native } = useMoralisWeb3Api();
  // const { data, fetch, setData } = useWeb3ExecuteFunction(
  //   native.runContractFunction,
  //   { ...options }
  // );

  // const { runContractFunction, data } = useWeb3Contract({
  //   abi: nftAbi,
  //   functionName: "owner",
  //   address: "0xd8Ad6001551Ced68c536De41F18C575185d49738",
  //   chain: "mumbai",
  // });
  // const { userWallet } = useContext(walletContext);

  // const { fetch, data, error, isLoading } = useMoralisWeb3ApiCall(
  //   native.runContractFunction,
  //   { ...options }
  // );

  // const uploadToFirebase = (file) => {
  //   console.log(file);
  // };

  // const fetchContractAddress = async (transactionHash) => {
  //   try {
  //     const response = await axios.get(
  //       `https://api-testnet.polygonscan.com/api?module=account&action=txlistinternal&txhash=${transactionHash}&apikey=${process.env.REACT_APP_POLYGON_SCAN_API_KEY}`
  //     );
  //     console.log(response);
  //     console.log(response.data.result[0].contractAddress);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  const onImageUpload = async ({ fileList }) => {
    const currentFiles = [...nftData.images];

    for (const file of fileList) {
      console.log(file, typeof file);
      const added = await client.add(file.originFileObj);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      currentFiles.push(url);
    }

    setNftData({ ...nftData, images: currentFiles });
  };

  const onJsonUpload = ({ fileList }) => {
    if (nftData.images.length < 1) {
      message.error("Please upload atleast one image");
      return <Confetti />;
    }
    const metadata = [...nftData.metadata];
    for (const [i, jsonFile] of fileList.entries()) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const json = JSON.parse(e.target.result);
        json.image = nftData.images[i];
        json.id = i;
        metadata.push(json);
      };
      reader.readAsText(jsonFile.originFileObj);
    }
    setNftData({ ...nftData, metadata });
  };

  const submitForm = async (values) => {
    try {
      console.log("creating table");
      let { mainTableHash, mainTableName } = await createMainTable(
        values.mainTableName
      );

      let { attributeTableName, attributeTableHash } =
        await createAttributeTable(values.attributeTableName);

      setTableNames({
        mainTable: mainTableName,
        attributeTable: attributeTableName,
      });

      console.log(mainTableHash, mainTableName, "mainTableHash, mainTableName");
      console.log(attributeTableHash, attributeTableName, "attributeTableHash");

      console.log("writing table");
      const sql = await prepareSqlStatement(
        mainTableName,
        attributeTableName,
        nftData.metadata
      );
      const response = await writeTable(sql);
      await set(ref(db, "collections/" + collectionAddress), {
        owner: userWallet,
        address: collectionAddress,
        time: new Date().toISOString(),
        coverImage: nftData.images[0],
        mainTable: { hash: mainTableHash, name: mainTableName },
        attributeTable: { hash: attributeTableHash, name: attributeTableName },
      });
      const dropCollectionContract = new web3.eth.Contract(
        dropCollectionAbi,
        collectionAddress
      );
      setCollectionContract(dropCollectionContract);

      console.log(response, "response");
    } catch (e) {
      console.log(e);
    }
    // options.params.name = values.collectionName;
    // options.params.symbol = values.symbol;
    // options.params.treasury = values.collectionTreasuryAddress;
    // options.params.royalty = values.royaltyAddress;
    // options.params.royaltyFee = values.royaltyFees;
    // try {
    //   // await runContractFunction(params);
    //   await fetch();
    //   console.log(data, "here is the data after the transaction");
    //   const transactionHash = data.hash;
    //   fetchContractAddress(transactionHash);
    // } catch (e) {
    //   console.log(e);
    // }
  };

  const updateAndMint = async () => {
    try {
      collectionContract.methods
        .setBaseUri(tableNames.mainTable, tableNames.attributeTable)
        .send({ from: userWallet, gas: "10000000", gasLimit: "8005758" });

      mint();
    } catch (e) {
      console.log(e);
    }
  };

  const mint = async () => {
    try {
      const response = await collectionContract.methods
        .mint()
        .send({ from: userWallet, gas: "10000000", gasLimit: "8005758" });
      setMinted([true, response.transactionHash]);
      console.log(response, "response from mint");
    } catch (e) {
      console.log(e);
    }
  };
  if (minted[0] === true) {
    return (
      <>
        <Confetti width={1280} height={800}></Confetti>
        <div className="collection-form-container">
          <Typography.Title>Congratulations!</Typography.Title>
          <h2>Your collection has been created!</h2>
          <p>transaction hash: {minted[1]}</p>
        </div>
      </>
    );
  }
  return (
    <div className="collection-form-container">
      <Title className="collection-form-title" level={1}>
        Create a table
      </Title>
      <Form
        {...formItemLayout}
        className="create-collection-form"
        onFinish={submitForm}
      >
        <Form.Item name="mainTableName" label="Main Table name">
          <Input />
        </Form.Item>
        <Form.Item name="attributeTableName" label="Attribute Table name">
          <Input />
        </Form.Item>

        <Form.Item name="images" label="image files">
          <Dragger multiple onChange={onImageUpload}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Supports for a single or bulk upload.
            </p>
          </Dragger>
        </Form.Item>

        <Form.Item name="attributes" label="metadata files">
          <Dragger multiple onChange={onJsonUpload}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Supports for a single or bulk upload.
            </p>
          </Dragger>
        </Form.Item>

        <Form.Item
          wrapperCol={{
            xs: {
              span: 24,
              offset: 0,
            },
            sm: {
              span: 16,
              offset: 8,
            },
          }}
        >
          <Button htmlType="submit">Submit</Button>
        </Form.Item>
      </Form>
      <Button onClick={updateAndMint}>Update table name & mint</Button>
    </div>
  );
}
