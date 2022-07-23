import React, { useContext, useEffect } from "react";
import "./CreateCollection.css";

import { Button, Form, Input, Upload, Typography } from "antd";
import { InboxOutlined } from "@ant-design/icons";

// import firebase from "../../firebase/config";
import { getDatabase, ref, set } from "firebase/database";
import { db, firebaseApp } from "../../firebase/config";
import { walletContext } from "../../context/index";
import nftContract from "../../web3/nftContract";
import { useNavigate, Link } from "react-router-dom";
// import {
//   useMoralisWeb3Api,
//   useMoralisWeb3ApiCall,
//   useWeb3Contract,
//   useApiContract,
//   useWeb3ExecuteFunction,
// } from "react-moralis";

import nftAbi from "../../abi/nftc.json";
// import useNftContract from "../../hooks/useNftContract";
import axios from "axios";

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

export default function CreateCollection() {
  const { userWallet } = useContext(walletContext);
  const navigate = useNavigate();

  // const options = {
  //   abi: nftAbi,
  //   contractAddress: process.env.REACT_APP_NFTC_PROXY_ADDRESS,
  //   functionName: "createDropCollection",
  //   function_name: "createDropCollection",
  //   chain: "mumbai",
  // };

  const options = {
    abi: nftAbi,
    contractAddress: process.env.REACT_APP_NFTC_PROXY_ADDRESS,
    functionName: "createDropCollection",
    function_name: "createDropCollection",
    chain: "mumbai",
    params: {
      name: "FD",
      symbol: "GD",
      treasury: "0x464e3f471628e162fa34f130f4c3bcc41ff7635d",
      royalty: "0x464e3f471628e162fa34f130f4c3bcc41ff7635d",
      royaltyFee: 1,
    },
  };

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

  const fetchContractAddress = async (transactionHash) => {
    try {
      const response = await axios.get(
        `https://api-testnet.polygonscan.com/api?module=account&action=txlistinternal&txhash=${transactionHash}&apikey=${process.env.REACT_APP_POLYGON_SCAN_API_KEY}`
      );
      console.log(response);
      if (response.data.result.length < 1) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log(response, response.data);
        return fetchContractAddress(transactionHash);
      } else {
        return response.data.result[0].contractAddress;
      }
    } catch (e) {
      console.log(e);
    }
  };

  const submitForm = async (values) => {
    const {
      collectionName,
      symbol,
      collectionTreasuryAddress,
      royaltyAddress,
      royaltyFees,
    } = values;
    const res = await nftContract.methods
      .createDropCollection(
        collectionName,
        symbol,
        collectionTreasuryAddress,
        royaltyAddress,
        royaltyFees
      )
      .send({ from: userWallet });
    console.log(res);
    const collectionAddress = await fetchContractAddress(res.transactionHash);
    // await set(ref(db, "collections/" + collectionAddress), {
    //   owner: userWallet,
    //   address: collectionAddress,
    //   time: new Date().toISOString(),
    // });
    console.log(collectionAddress, "collection address");
    return navigate("/create-table", { state: { collectionAddress } });

    // const res = await nftContract
    //   .getFees(["0xc9A7Eae76A98b8CC557D70bB3Db4e5D834d2864B"])
    //   .call();
    // const res = await nftContract.methods
    //   .createDropCollection(options.params)
    //   .send({ from: userWallet });

    // const params = {
    //   royalty: values.royaltyAddress,
    //   name: values.collectionName,
    //   treasury: values.collectionTreasuryAddress,
    //   royaltyFees: values.royaltyFees,
    //   symbol: values.symbol,
    // };
    // setData({ ...options, params });
    // console.log(params, "params");

    try {
      // await runContractFunction(params);
      // await fetch();
      // console.log(data, "here is the data after the transaction");
      // const transactionHash = data.hash;
      // fetchContractAddress(transactionHash);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="collection-form-container">
      <Title className="collection-form-title" level={1}>
        Create a collection
      </Title>

      <Form
        {...formItemLayout}
        className="create-collection-form"
        onFinish={submitForm}
      >
        <Form.Item name="collectionName" label="collection name">
          <Input />
        </Form.Item>
        <Form.Item name="symbol" label="symbol">
          <Input />
        </Form.Item>
        <Form.Item name="collectionTreasuryAddress" label="treasury address">
          <Input />
        </Form.Item>
        <Form.Item name="royaltyAddress" label="royalty address">
          <Input />
        </Form.Item>
        <Form.Item name="royaltyFees" label="royalty fees">
          <Input />
        </Form.Item>
        {/*         
        <Form.Item name="baseUriString" label="base uri string">
          <Input />
        </Form.Item>
        <Form.Item name="imageUriString" label="image uri string"></Form.Item>
        <Form.Item name="attributeUriString" label="attribute uri string">
          <Dragger multiple directory>
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
        </Form.Item> */}
        {/* </Form.Item>
        <Form.Item name="imageTableName" label="image table name">
          <Input />
          different form, 
        </Form.Item>
        <Form.Item name="attributeTableName" label="attribute table name">
          <Input /> */}
        {/* <Form.Item name="attributeUriJsons" label="attribute uri json">
          <Dragger multiple directory customRequest={uploadToFirebase}>
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
        </Form.Item> */}
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
      {/* <Link
        to="/create-table"
        state={{
          collectionAddress: "0x861c61e5ed8ab04fdccc1e400c372def24cf3dda",
        }}
      >
        Click here
      </Link> */}
    </div>
  );
}
