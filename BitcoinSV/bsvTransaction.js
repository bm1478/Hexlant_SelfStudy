// 1. Module Set
const bsv = require('bsv');
const bitcoinSVRPC = require('./bitcoinSVRPC');
const fs = require('fs');
const Transaction = bsv.Transaction;
const Script = bsv.Script;

// 2. DB Setting
const { sequelize } = require('./models/index');

const driver = async () => {
    try {
        await sequelize.sync();
    } catch(err) {
        console.error('초기화 실패');
        console.error(err);
        return;
    }
    console.log('초기화 완료.');
};
driver();

// 3. UTXO
const txId = "d7d072028270c30cb42542dcc59b5bb679d5e0d5846bc8d1881e5a3b5fe45b87";
const myAddress = "mz55g3wnEGF5G9JEJa5aeo44XLPeBbquy4";
const fromPrivateKey = 'cVUEE6DkkJqm871uwixZs6N557JFZ7jYVGBqLiaQAB5avovk9UdF';
// Taeyong's address
const toAddress = "mxgAyPKswTRGc5Z19RigbRpjGAmZ5uQFhH";
// 0.01 BSV
const amount = 1000000;
const fee = 400;

// get Transaction from bitcoin sv server
bitcoinSVRPC.getTransactionInfo(txId).then(result => {
    // UTXO
    let myUTXO = [];
    let voutList = result.vout;
    let outputIndex = 0;
    let satoshis = 0;
    for (var i = 0; i < voutList.length; i++) {
        var tempAddress = voutList[i].scriptPubKey.addresses[0];
        if (tempAddress === myAddress) {
            outputIndex = i;
            satoshis = voutList[i].value * 100000000;
            myUTXO.push(voutList[i]);
        }
    }

    /*for(var i=0; i<myUTXO.length; i++) {
        let myUtxoInfo = {
            'txId': txId,
            'utxo': myUTXO[i]
        };
        myUtxoInfo = JSON.stringify(myUtxoInfo);
        fs.writeFileSync(myAddress + 'myUtxoInfo.json', myUtxoInfo, 'utf-8');
    }*/

    const utxos = {
        address: myAddress,
        txId: txId,
        outputIndex: outputIndex,
        script: Script.buildPublicKeyHashOut(myAddress).toString(),
        satoshis: satoshis
    };

    // 4. Transaction
    const transaction = new Transaction()
        .from(utxos)
        .to(toAddress, amount)
        .fee(fee)
        .change(myAddress)
        .sign(fromPrivateKey);

    const rawTx = transaction.serialize(true);
    console.log(rawTx);
    //bitcoinSVRPC.sendRawTransaction(rawTx).then(console.log);
    //bitcoinSVRPC.getTransactionInfo('8f62b7401ccdba0a7a46fc1cac752da97b5aca5ea5d4872f28ba416a82250433').then(console.log);
});

