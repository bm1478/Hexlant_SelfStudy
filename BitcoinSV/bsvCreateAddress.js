let bsv = require('bsv');
let privateKey = bsv.PrivateKey.fromRandom('testnet');
let publicKey = bsv.PublicKey.fromPrivateKey(privateKey);
let address = bsv.Address.fromPublicKey(publicKey, 'testnet');

console.log(privateKey.toWIF());
console.log(publicKey.toHex());
console.log(address.toString());

/*var networkMagic = {
    livenet: 0xe3e1f3e8,
    testnet: 0xf4e5f3f4,
    regtest: 0xdab5bffa,
    stn: 0xfbcec4f9
};

var dnsSeeds = [
    'seed.bitcoinsv.org',
    'seed.bitcoinunlimited.info'
];

var TESTNET = {
    PORT: 18333,
    NETWORK_MAGIC: networkMagic.testnet,
    DNS_SEEDS: dnsSeeds,
    PREFIX: 'testnet',
    CASHADDRPREFIX: 'bchtest'
};

var testNetwork = {
    name: 'testnet',
    prefix: TESTNET.PREFIX,
    cashAddrPrefix: TESTNET.CASHADDRPREFIX,
    pubkeyhash: 0x6f,
    privatekey: 0xef,
    scripthash: 0xc4,
    xpubkey: 0x043587cf,
    xprivkey: 0x04358394,
    networkMagic: TESTNET.NETWORK_MAGIC
};*/

