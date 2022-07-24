import { connect } from "@tableland/sdk";

let tableland = null;
const connectTableLand = async () => {
  const tablelandInstance = await connect({
    network: "testnet",
    chain: "polygon-mumbai",
  });
  console.log(tableland, "is tableland");
  tableland = tablelandInstance;
};
// connectTableLand();

export { connectTableLand, tableland };
