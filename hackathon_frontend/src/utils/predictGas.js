import axios from "axios";
import web3 from "web3";

const gasPredict = async () => {
  let response = await axios.get("https://gasstation-mumbai.matic.today/v2");
  // response = await response.json();
  console.log(response.data.fast.maxFee);
  return Math.ceil(response.data.fast.maxFee);
  // console.log(("" + response.data.fast.maxFee).split(".")[0]);
  // const toWei = web3.utils.toWei(
  //   ("" + response.data.fast.maxFee).split(".")[0],
  //   "gwei"
  // );
  // const toEthers = web3.utils.fromWei(toWei, "ether");
  // console.log(response.data.fast.maxFee, web3.utils.fromWei("1", "Gwei"));
  // return web3.utils.fromWei(
  //   (
  //     "" +
  //     web3.utils.toWei(("" + response.data.fast.maxFee).split(".")[0], "Gwei")
  //   ).split(".")[0],
  //   "ether"
  // );
  // return "" + toEthers;
};

export default gasPredict;
