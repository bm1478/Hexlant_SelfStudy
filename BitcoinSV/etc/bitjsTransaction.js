// Module and Net Parameter
const bitcoinSVRPC = require("../bitcoinSVRPC.js");
const bitcoin = require('bitcoinjs-lib');
const fs = require('fs');
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

// Import Key
const keyPair = bitcoin.ECPair.fromWIF('cUzuFwVQKuGsbT34GRWCb6vb1koT4p58JEf7rZeNqSp8yxAMNhPn', BITCOIN_SV_TESTNET);
const {address} = bitcoin.payments.p2pkh({
    pubkey: keyPair.publicKey,
    network: BITCOIN_SV_TESTNET,
});

// My Address: 'mtXSrvzzE7ABYttiH1zvNykaiQXXQWW7Ko'
// Taeyong's address: 'mzxMEifPSNA85SNX6ArCsqrRMRgMadjQgx'

// UTXO Parsing
const txId = '16ef314663065f2826070e3e29b9132a1bb1519a5ce2bde5bc01dc84f67fbb0b';

bitcoinSVRPC.getTransactionInfo(txId).then(result => {
    let previousTx = result.hex;
    let myUTXO = [];
    let utxoList = result.vout;
    for (var i = 0; i < utxoList.length; i++) {
        var tempAddress = utxoList[i].scriptPubKey.addresses[0];
        if (tempAddress === address) {
            myUTXO.push(utxoList[i]);
        }
    }

    for(var i=0; i<myUTXO.length; i++) {
        let utxoInfo = {
            'txId': txId,
            'utxo': myUTXO[i]
        }
        utxoInfo = JSON.stringify(utxoInfo);
        fs.writeFileSync('utxoInfo.json', utxoInfo, 'utf-8');
    }

    // Transaction
    var psbt = new bitcoin.Psbt({network: BITCOIN_SV_TESTNET});
    psbt.addInput({
        hash: txId,
        index: 0,
        nonWitnessUtxo: Buffer.from(
            previousTx,
            'hex',
        ),
    });
    psbt.addOutput({
        address: "mzxMEifPSNA85SNX6ArCsqrRMRgMadjQgx",
        value: 100000,
    });
    psbt.signInput(0, keyPair);
    psbt.validateSignaturesOfInput(0);
    psbt.finalizeAllInputs();
    console.log(psbt.extractTransaction(true).toHex());
    bitcoinSVRPC.decodeRawTransaction(psbt.extractTransaction(true).toHex()).then(console.log);
    bitcoinSVRPC.sendRawTransaction(psbt.extractTransaction(true).toHex()).then(console.log);
    //bitcoinSVRPC.getTransactionInfo('7e2a8de4b8b423997fa3482c860c15b7d380dc72e623830676e15fc59d99fa8e').then(console.log);
    //bitcoinSVRPC.getTransactionInfo('f0315ffc38709d70ad5647e22048358dd3745f3ce3874223c80a7c92fab0c8ba').then(console.log);
});
