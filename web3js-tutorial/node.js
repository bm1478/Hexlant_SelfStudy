var Web3 = require('web3');
//console.log(Web3.modules);

// Providers
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
web3.setProvider('ws://localhost:8546');
//var net = require('net');
//var web3 = new Web3('/Users/myuser/Library/Ethereum/geth.ipc', net);
//var web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');
console.log(web3.version, Web3.version);
console.log(web3.currentProvider);
//console.log(web3.utils, Web3.utils);

// Extend
web3.extend({
    property: 'myModule',
    methods: [{
        name: 'getBalance',
        call: 'eth_getBalance',
        params: 2,
        inputFomatter: [web3.extend.formatters.inputAddressFormatter, web3.extend.formatters.inputDefualtBlockNumberFormatter],
        outputFormatter: web3.utils.hexToNumberString
    }, {
        name: 'getGasPriceSuperFunction',
        call: 'eth_gasPriceSuper',
        params: 2,
        inputFormatter: [null, web3.utils.numberToHex]
    }]
});

web3.extend({
    methods: [{
        name: 'directCall',
        call: 'eth_callForFun',
    }]
});
//console.log(web3);

web3.eth.defaultAccount = '0x6E8B9ab63937c8fF33D0Fa6e03bB0cbFE17b18f3';
console.log(web3.eth.defaultAccount);
console.log(web3.eth.defaultBlock);