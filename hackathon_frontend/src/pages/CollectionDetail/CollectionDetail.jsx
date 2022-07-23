import React, { useEffect, useState, useContext } from "react";

import {
  Button,
  Card,
  Input,
  Form,
  Typography,
  Drawer,
  message,
  Empty,
  Spin,
  Carousel,
  Image,
} from "antd";
import web3 from "../../web3/index";
import moment from "moment";
import useTableLandConnection from "../../hooks/useTableLandConnection";

import { useParams } from "react-router-dom";
import "./CollectionDetail.css";
import collectionAbi from "../../abi/dropCollection.json";
import { connect } from "@tableland/sdk";
import { collectionContext, walletContext } from "../../context/index";

export default function CollectionDetail() {
  const { collectionId } = useParams();
  const { collectionData } = useContext(collectionContext);
  // const collectionId = "0xc704f9c991d15eb9a95d6fa5b9666149a49679d2";
  const currentCollection = collectionData[collectionId];
  console.log(collectionId);

  const { initializeTableland } = useTableLandConnection();
  const [currentContract, setCurrentContract] = useState({});
  const [tableData, setData] = useState({
    mainTable: { rows: [] },
    attributeTable: { rows: [] },
  });

  useEffect(() => {
    const currentContract = new web3.eth.Contract(collectionAbi, collectionId);
    setCurrentContract(currentContract);
  }, []);

  useEffect(() => {
    const fetchDataFromTableLane = async () => {
      try {
        const tableLandConnection = await initializeTableland();
        const sqlStatementMainTable = `select * from ${currentCollection.mainTable.name}`;
        const sqlStatementAttributeTable = `select * from ${currentCollection.attributeTable.name}`;

        console.log(sqlStatementMainTable);
        let responseMaintable = await tableLandConnection.read(
          sqlStatementMainTable
        );
        console.log(responseMaintable, "response from tableland");
        console.log(sqlStatementAttributeTable);
        let responseAttributetable = await tableLandConnection.read(
          sqlStatementAttributeTable
        );
        console.log(responseAttributetable, "response from tableland");
        setData({
          mainTable: responseMaintable,
          attributeTable: responseAttributetable,
        });
      } catch (e) {
        console.log(e);
      }
    };
    if (currentCollection) {
      fetchDataFromTableLane();
    }
  }, [currentCollection]);

  if (tableData.mainTable.rows.length <= 0) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="collection-content-page">
      <div className="carousel-background-container">
        <Card
          hoverable
          style={{
            width: 240,
          }}
          cover={
            <Carousel
              autoplay
              // speed={0.1}
              dots={false}
              effect="fade"
              autoplaySpeed={500}
            >
              {tableData.mainTable.rows.map((row) => {
                const [id, title, description, image] = row;
                return (
                  <div key={id}>
                    <Image src={image} className="carousel-image" />
                  </div>
                );
              })}
            </Carousel>
          }
        >
          <span>
            <Typography.Text style={{ maxWidth: "200px" }} ellipsis copyable>
              {collectionId}
            </Typography.Text>
          </span>
        </Card>

        <div className="about-collection">
          <span className="collection-name">
            {collectionData[collectionId].mainTable.name}
          </span>
          <span>Total nfts: {tableData.mainTable.rows.length}</span>
          <span>
            Last update: {moment(collectionData[collectionId].time).fromNow()}
          </span>
          <span>
            Creator:
            <Typography.Text
              style={{ maxWidth: "200px" }}
              ellipsis
              copyable
              code
            >
              {collectionData[collectionId].owner}
            </Typography.Text>
          </span>
        </div>
      </div>
      <div className="minted-nfts">
        <Typography.Title level={3}>Minted NFTs</Typography.Title>
        <div className="nft-container">
          {tableData.mainTable.rows.map((row, i) => {
            const [id, title, description, image] = row;
            return (
              <Card
                hoverable
                style={{
                  width: 240,
                }}
                key={id}
                cover={<Image alt="example" src={image} />}
              >
                <Card.Meta title={title} description={description} />
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const contentStyle = {
  height: "160px",
  maxWidth: "500px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
};
