import React, { useContext } from "react";
import "./HomePage.css";
import { Button, Typography, Empty, Card } from "antd";
import {
  useParams,
  useSearchParams,
  useLocation,
  useNavigate,
  Link,
} from "react-router-dom";
import useWriteTables from "../../utils/writeTable";
import prepareSqlStatement from "../../utils/prepareSqlStatement";
import writeTable from "../../utils/writeTable";
import { collectionContext, walletContext } from "../../context/index";

const { Title } = Typography;
const { Text } = Typography;

export default function HomePage() {
  const { collectionData } = useContext(collectionContext);
  const navigate = useNavigate();
  const { userWallet } = useContext(walletContext);
  // // console.log(searchParams, "search params");
  // let params = useLocation();
  // params = new URLSearchParams(params.search);
  // const mainTable = params.get("mainTable");
  // const attributeTable = params.get("attributeTable");

  // const onButtonPressHandler = async () => {
  //   const sql = await prepareSqlStatement(mainTable, attributeTable);
  //   const response = await writeTable(sql);
  //   console.log(response, "response");
  // };
  if (collectionData.length === 0) {
    return (
      <div className="content-container">
        <Empty
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          imageStyle={{
            height: 60,
          }}
          description={
            <span>
              Customize <a href="#API">Description</a>
            </span>
          }
        >
          <Link to="/create-collection">
            <Button type="primary">Create Now</Button>
          </Link>
        </Empty>
      </div>
    );
  }
  console.log(collectionData);

  return (
    <div className="collection-container">
      {Object.keys(collectionData).map((collection) => {
        return (
          <div key={collection}>
            <Card
              onClick={() => {
                navigate(`/collection/${collection}`);
              }}
              className="collection-card"
              hoverable
              cover={
                <div>
                  <img
                    alt="example"
                    src={collectionData[collection].coverImage}
                    className="collection-cover-image"
                  />
                </div>
              }
            >
              <>
                <Card.Meta
                  title={collectionData[collection].mainTable.name}
                  description={
                    <EllipsisMiddle
                      suffixCount={10}
                      className="collection-description"
                    >
                      {"creator: " + collectionData[collection].owner}
                    </EllipsisMiddle>
                  }
                />
                <EllipsisMiddle
                  copyable
                  className="collection-description"
                  suffixCount={10}
                >
                  {"hash code: " + collection}
                </EllipsisMiddle>
                {/* // description={
                //   <div>
                //     <EllipsisMiddle suffixCount={5}>
                //       {"created by: " + collectionData[collection].owner}
                //     </EllipsisMiddle>
                //   </div>
                // } */}
              </>
            </Card>
          </div>
        );
      })}

      {/* <Button onClick={onButtonPressHandler}>Click me</Button> */}
    </div>
  );
}

const EllipsisMiddle = ({ suffixCount, children, ...otherProps }) => {
  const start = children.slice(0, children.length - suffixCount).trim();
  const suffix = children.slice(-suffixCount).trim();
  return (
    <Text
      copyable
      style={{
        maxWidth: "100%",
      }}
      ellipsis={{
        suffix,
      }}
      {...otherProps}
    >
      {start}
    </Text>
  );
};
