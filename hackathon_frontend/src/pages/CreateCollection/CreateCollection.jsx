import React from "react";
import "./CreateCollection.css";

import { Button, Form, Input, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import firebase from "../../firebase/config";
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
  const uploadToFirebase = (file) => {
    console.log(file);
  };
  return (
    <div className="collection-form-container">
      <Form {...formItemLayout} className="create-collection-form">
        <Form.Item name="collectionName" label="collection name">
          <Input />
        </Form.Item>
        <Form.Item name="symbol" label="symbol">
          <Input />
        </Form.Item>
        <Form.Item name="imageTableName" label="image table name">
          <Input />
        </Form.Item>
        <Form.Item name="attributeTableName" label="attribute table name">
          <Input />
        </Form.Item>
        <Form.Item
          name="collectionTreasuryAddress"
          label="address for collection treasury"
        >
          <Input />
        </Form.Item>
        <Form.Item name="royaltyFees" label="royalty fees">
          <Input />
        </Form.Item>
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
        </Form.Item>
        <Form.Item name="attributeUriJsons" label="attribute uri json">
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
    </div>
  );
}
