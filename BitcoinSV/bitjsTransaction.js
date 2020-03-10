// Module and Net Parameter
const bitcoinSVRPC = require("./bitcoinSVRPC.js");
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

    console.log(previousTx, myUTXO);
    // Transaction
    var psbt = new bitcoin.Psbt({network: BITCOIN_SV_TESTNET});
    console.log(little.toString());
    psbt.addInput({
        hash: '16ef314663065f2826070e3e29b9132a1bb1519a5ce2bde5bc01dc84f67fbb0b',
        index: 0,
        nonWitnessUtxo: Buffer.from(
            previousTx +
            // value in satoshis (Int64LE) = 9000000
            '4054890000000000' +
            '19' +
            myUTXO[0].scriptPubKey.hex +
            '00000000',
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
    console.log(psbt.extractTransaction.toHeX());
    //bitcoinSVRPC.sendRawTransaction(tx.build().toHex());
});
