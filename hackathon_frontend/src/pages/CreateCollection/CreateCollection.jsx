import React, { useContext } from "react";
import "./CreateCollection.css";

import { Button, Form, Input, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import firebase from "../../firebase/config";
import { walletContext } from "../../context/index";
import {
  useMoralisWeb3Api,
  useMoralisWeb3ApiCall,
  useWeb3Contract,
  useApiContract,
  useWeb3ExecuteFunction,
} from "react-moralis";

import nftAbi from "../../abi/nftc.json";
import useNftContract from "../../hooks/useNftContract";
import axios from "axios";

const { Dragger } = Upload;

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
  const { data, fetch, setData } = useWeb3ExecuteFunction();
  // const { data, error, runContractFunction, isFetching, isLoading } =
  // useApiContract({
  //   abi: nftAbi,
  //   functionName: "owner",
  //   address: "0xd8Ad6001551Ced68c536De41F18C575185d49738",
  //   chain: "mumbai",
  //   params: [],
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
      console.log(response.data.result[0].contractAddress);
    } catch (e) {
      console.log(e);
    }
  };

  const submitForm = async (values) => {
    const params = {
      royalty: values.royaltyAddress,
      name: values.collectionName,
      treasury: values.collectionTreasuryAddress,
      royaltyFees: values.royaltyFees,
      symbol: values.symbol,
    };
    console.log(params, "params");

    try {
      await fetch({
        abi: nftAbi,
        contractAddress: process.env.REACT_APP_NFTC_PROXY_ADDRESS,
        functionName: "createDropCollection",
        params,
      });
      console.log(data, "here is the data after the transaction");
      const transactionHash = data.hash;
      fetchContractAddress(transactionHash);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="collection-form-container">
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
        <Form.Item
          name="collectionTreasuryAddress"
          label="address for collection treasury"
        >
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
    </div>
  );
}
