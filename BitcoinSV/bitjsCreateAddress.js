const bitcoin = require('bitcoinjs-lib');

const BITCOIN_SV_TESTNET = {
    messagePrefix: '\x19BitcoinSV Signed Message:\n',
    bech32: 'tbsv',
    bip32: {
        public: 0x043587cf,
        private: 0x04358394,
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef,
};

const keyPair = bitcoin.ECPair.makeRandom({ network: BITCOIN_SV_TESTNET });
const { address } = bitcoin.payments.p2pkh({
    pubkey: keyPair.publicKey,
    network: BITCOIN_SV_TESTNET,
});

console.log(keyPair);
console.log(address);

var publicKey = keyPair.publicKey.toString('hex');
console.log("public Key " + publicKey);

var wif = keyPair.toWIF();
console.log('private key WIF ' + wif);


