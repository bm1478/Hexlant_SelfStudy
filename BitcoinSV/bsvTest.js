const bsvModule = require('./bsvModule');
//console.log(bsvModule.getAddressFromWIF('cVUEE6DkkJqm871uwixZs6N557JFZ7jYVGBqLiaQAB5avovk9UdF', 'testnet'));

const txId = "d7d072028270c30cb42542dcc59b5bb679d5e0d5846bc8d1881e5a3b5fe45b87";
const myAddress = "mz55g3wnEGF5G9JEJa5aeo44XLPeBbquy4";
const fromPrivateKey = 'cVUEE6DkkJqm871uwixZs6N557JFZ7jYVGBqLiaQAB5avovk9UdF';
//bsvModule.saveUTXOFromTxID(myAddress, txId).then(console.log);

//console.log(bsvModule.createAddressP2SHForm('testnet'));
const bsv = require('bsv');
const address = bsv.Address("2N3YSUvvYfEFFVEzUjFFonntDqsbiuysDzF", 'testnet');
console.log(address.isPayToPublicKeyHash(), address.isPayToScriptHash());

bsvModule.sendToAddress(fromPrivateKey, address, 0.001).then(console.log);
