const bsv = require('bsv');
const bitcoinSVRPC = require('./bitcoinSVRPC');
// first, Do "sequelize init"
const { sequelize, transactions }= require('./models/index.js');

// p2pkh (pay to public key hash)
function createAddressFromRandom(netParameter) {
   let privateKey = bsv.PrivateKey.fromRandom(netParameter);
   let publicKey = bsv.PublicKey.fromPrivateKey(privateKey);
   let address = bsv.Address.fromPublicKey(publicKey, netParameter);
   let result = {
       privateKeyWIF: privateKey.toWIF(),
       publicKey : publicKey.toString(),
       address: address.toString(),
   };
   return result;
};

// p2sh (pay to script hash)
function createAddressP2SHForm(netParameter) {
    let privateKey = bsv.PrivateKey.fromRandom(netParameter);
    let publicKey = bsv.PublicKey.fromPrivateKey(privateKey);
    let publicKeySet = [];
    publicKeySet.push(publicKey);
    var address = bsv.Address.createMultisig(publicKeySet, 1, netParameter);
    let result = {
        privateKeyWIF: privateKey.toWIF(),
        publicKey : publicKey.toString(),
        address: address.toString(),
    };
    return result;
};

function getAddressFromWIF(privateKeyWIF , netParameter) {
    let privateKey = bsv.PrivateKey.fromWIF(privateKeyWIF);
    let publicKey = bsv.PublicKey.fromPrivateKey(privateKey);
    let address = bsv.Address.fromPrivateKey(privateKey, netParameter);
    let result = {
        privateKeyWIF : privateKey.toWIF(),
        publicKey: publicKey.toString(),
        address: address.toString(),
    };
    return result;
};

async function connectDB() {
    try {
        await sequelize.sync();
    } catch(err) {
        console.error(err);
        return;
    }
};

async function saveUTXOFromTxID(address, txId) {
    const connectResult = await connectDB();
    console.log(connectResult);
    const rpcResult = await bitcoinSVRPC.getTransactionInfo(txId);
    let myUTXO = [];
    let voutList = rpcResult.vout;
    for (var i = 0; i < voutList.length; i++) {
        var tempAddress = voutList[i].scriptPubKey.addresses[0];
        if(tempAddress === address) {
            let tempResult = {
                outputindex: i,
                satoshis:voutList[i].value * 100000000,
            };
            myUTXO.push(tempResult);
        }
    }

    for (var i=0; i<myUTXO.length; i++) {
        try {
            transactions.create({
                address:address,
                txid: txId,
                outputindex: myUTXO[i].outputindex,
                satoshis: myUTXO[i].satoshis,
                is_spent: false,
            });
        } catch(err) {
            console.log(err)
        };
    }
    return "Success";
};

async function sendToAddress(fromPrivateKey, toAddress, amount) {
    await connectDB();
    let sqlResultSet = await transactions.findAll({});
    let sqlResult = sqlResultSet[0];
    let fromAddress = sqlResult.address;
    let txId = sqlResult.txid;
    let outputIndex = sqlResult.outputindex;
    let satoshis = sqlResult.satoshis;
    const utxos = {
        address: fromAddress,
        txId: txId,
        outputIndex: outputIndex,
        script: bsv.Script.buildPublicKeyHashOut(fromAddress).toString(),
        satoshis: satoshis
    };
    const fee = 400;
    const transaction = new bsv.Transaction()
        .from(utxos)
        .to(toAddress, amount * 100000000)
        .fee(fee)
        .change(sqlResult.address)
        .sign(fromPrivateKey);

    // To Spent UTXO
    transactions.update({is_spent: true}, {where: {txid: txId}});

    const rawTx = transaction.serialize(true);
    console.log(rawTx);
    //bitcoinSVRPC.sendRawTransaction(rawTx).then(console.log);
    return "Success";
}

module.exports = {
    createAddressFromRandom,
    createAddressP2SHForm,
    getAddressFromWIF,
    connectDB,
    saveUTXOFromTxID,
    sendToAddress,
};