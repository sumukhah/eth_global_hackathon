import web3 from "./index";
import nftAbi from "../abi/nftc.json";
const nftContract = new web3.eth.Contract(
  nftAbi,
  process.env.REACT_APP_NFTC_PROXY_ADDRESS
);
console.log(nftContract);

export default nftContract;
