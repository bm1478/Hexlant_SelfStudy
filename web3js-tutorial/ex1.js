var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider || "ws.localhost:8546");
console.log(Web3.modules);
console.log(Web3.version);