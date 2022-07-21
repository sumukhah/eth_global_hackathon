const Moralis = new window.Moralis();
const appId = "LnkwfCJMIhZJtvpLBR9BnlzVU48NMhOs20FP4epF";
const serverUrl = "https://ikimg4jikowe.usemoralis.com:2053/server";
console.log(Moralis);
Moralis.start({ serverUrl, appId });

export default Moralis;
