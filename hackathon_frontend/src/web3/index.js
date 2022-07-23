import Web3 from "web3";
import { use } from "@maticnetwork/maticjs";
import { Web3ClientPlugin } from "@maticnetwork/maticjs-web3";

const web3 = new Web3(window.ethereum);

export default web3;
