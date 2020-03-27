const Web3 = require('web3');
const fs = require('fs');

const result = JSON.parse(fs.readFileSync('./ropstenAPIKey.json', 'utf8'));
const ropstenAPIKey = result["key"];

// const web3 = new Web3('wss://ropsten.infura.io/ws/v3/' + ropstenAPIKey);
const web3 = new Web3('https://ropsten.infura.io/v3/' + ropstenAPIKey);

async function getTx(txId) {
  const result = await web3.eth.getTransaction(txId);
  console.log(result);
  return result;
}

getTx('0xfdc43104e7e342c4da0cf6173e13bf17e20c0007ad87b2133ea500f9523e469a');
web3.eth.getNodeInfo().then(console.log);
web3.eth.getBlockNumber().then(result => {
  web3.eth.getTransactionFromBlock(result, 1).then(console.log);
});

web3.eth.getGasPrice().then((result) => {
  console.log(result);
});

