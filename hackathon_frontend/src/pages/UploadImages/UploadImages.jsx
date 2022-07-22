import React from "react";
import "./UploadImages.css";
import { Button, Typography } from "antd";
import { useParams, useSearchParams, useLocation } from "react-router-dom";
import useWriteTables from "../../utils/writeTable";
import prepareSqlStatement from "../../utils/prepareSqlStatement";
import writeTable from "../../utils/writeTable";
const { Title } = Typography;

export default function UploadImages() {
  // console.log(searchParams, "search params");
  let params = useLocation();
  params = new URLSearchParams(params.search);
  const mainTable = params.get("mainTable");
  const attributeTable = params.get("attributeTable");

  const onButtonPressHandler = async () => {
    const sql = await prepareSqlStatement(mainTable, attributeTable);
    const response = await writeTable(sql);
    console.log(response, "response");
  };

  return (
    <div className="collection-form-container">
      <Title className="collection-form-title" level={1}>
        Write on table
      </Title>
      <Button onClick={onButtonPressHandler}>Click me</Button>
    </div>
  );
}
