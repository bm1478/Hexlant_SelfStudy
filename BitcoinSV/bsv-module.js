const bsv = require('bsv');
const Mnemonic = require('bsv/mnemonic');
const bitcoinSVRPC = require('./bitcoin-sv-rpc');
// first, Do "sequelize init"
const { sequelize, Sequelize, utxo, address }= require('./models/index.js');

// p2pkh (pay to public key hash)
function createAddress(netParameter) {
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

function getAddressFromWIF(privateKeyWIF, netParameter) {
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

// Connect localhost Database
async function connectDB() {
    try {
        await sequelize.sync();
    } catch(err) {
        return err;
    }
};

// Create New Mnemonic
function createNewMnemonic() {
    let mnemonic = Mnemonic.fromRandom();
    return mnemonic.toString();
};

async function getNewAddressFromSeed(seed, netParameter) {
    let mnemonic = Mnemonic.fromString(seed);
    let rootHdPrivateKey = bsv.HDPrivateKey.fromSeed(mnemonic.toSeed(), netParameter);
    await connectDB();
    let seedCount = await address.count({ where: {seed: seed}} );
    let newPath = "m/0/0/" + seedCount.toString();
    let newHdPrivateKey = rootHdPrivateKey.deriveChild(newPath);
    let privateKey = newHdPrivateKey.privateKey;
    let publicKey = newHdPrivateKey.publicKey.toString();
    let hdAddress = bsv.Address.fromPrivateKey(privateKey, netParameter)
    try {
        address.create({
            seed: seed,
            address:hdAddress.toString(),
            path: newPath,
            seedIndex: seedCount,
        });
    } catch(err) {
        return err;
    }
    let result = {
        privateKey:privateKey.toString(),
        publicKey:publicKey.toString(),
        hdAddress:hdAddress.toString(),
    };
    return result;
};

async function getAddressFromSeedAndIndex(seed, index, netParameter) {
    let mnemonic = Mnemonic.fromString(seed);
    let rootHdPrivateKey = bsv.HDPrivateKey.fromSeed(mnemonic.toSeed(), netParameter);
    await connectDB();
    let seedCount = await address.count({where: {seed: seed}} );
    if(index+1 > seedCount) {
        return "Invalid Index.";
    }
    let getPath = "m/0/0/" + index.toString();
    let getHdPrivateKey = rootHdPrivateKey.deriveChild(getPath);
    let privateKey = getHdPrivateKey.privateKey;
    let publicKey = getHdPrivateKey.publicKey.toString();
    let hdAddress = bsv.Address.fromPrivateKey(privateKey, netParameter);
    let result = {
        privateKey:privateKey.toString(),
        publicKey:publicKey.toString(),
        hdAddress:hdAddress.toString(),
    };
    return result;
}

// Save UTXO From TxId
async function saveUTXOFromTxID(txId) {
    await connectDB();
    const rpcResult = await bitcoinSVRPC.getTransactionInfo(txId);
    let utxoList = [];

    let voutList = rpcResult.vout;
    for (var i = 0; i < voutList.length; i++) {
        let tempResult = {
            address: voutList[i].scriptPubKey.addresses[0],
            outputindex: i,
            satoshis:voutList[i].value * 100000000,
        };
        utxoList.push(tempResult);
    }

    for (var i=0; i<utxoList.length; i++) {
        try {
            utxo.create({
                address:utxoList[i].address,
                txid: txId,
                outputindex: utxoList[i].outputindex,
                satoshis: utxoList[i].satoshis,
                is_spent: false,
            });
        } catch(err) {
            return err;
        };
    }
    return "Success";
};

async function sendToAddress(fromAddress, fromPrivateKey, toAddress, amount) {
    await connectDB();
    const Op = Sequelize.Op;
    const fee = 400;
    let sqlResultSet = await utxo.findAll({
            where: {
                address: fromAddress,
                satoshis: {
                    [Op.gte]: amount * 100000000 + fee,
                },
                is_spent: false
            },
        }
    );
    if(sqlResultSet.length >= 1) {
        let sqlResult = sqlResultSet[0];
        let id = sqlResult.id;
        let txId = sqlResult.txid;
        let outputIndex = sqlResult.outputindex;
        let satoshis = sqlResult.satoshis;
        const utxos = {
            address: fromAddress,
            txId: txId,
            outputIndex: outputIndex,
            script: bsv.Script.buildPublicKeyHashOut(fromAddress).toString(),
            satoshis: satoshis,
        };
        let amountOfSathoshis = parseInt((amount * 100000000).toString());
        const transaction = new bsv.Transaction()
            .from(utxos)
            .to(toAddress, amountOfSathoshis)
            .fee(fee)
            .change(fromAddress)
            .sign(fromPrivateKey);

        const rawTx = transaction.serialize(true);
        try {
            bitcoinSVRPC.decodeRawTransaction(rawTx).then(result => {
                console.log(result);
            });
            bitcoinSVRPC.sendRawTransaction(rawTx).then(newTxId => {
                //사용 완료하면 UTXO로 저장, 사용한 UTXO는 is_spent = true, 새로 생긴 UTXO는 is_spent = false
                utxo.update({is_spent:true}, {
                    where: {
                        id: id,
                    },
                })
                saveUTXOFromTxID(newTxId);
            });
        }catch(err) {
            return err;
        }
        return "Success";
    }
    else {
        return "No Available UTXOs";
    }
};

async function getBlockTransactions(blockIndex) {
    const blockInfo = await bitcoinSVRPC.getBlockInfo(blockIndex);
    return blockInfo;
};

async function getAddressBalance(myAddress) {
    await connectDB();
    let sqlResultSet = await utxo.findAll({
        where: {
            address:myAddress,
        }
    });
    let balance = 0;
    for(var i = 0; i < sqlResultSet.length; i++) {
        if(!sqlResultSet[i].is_spent) {
            balance += sqlResultSet[i].satoshis;
        }
    }
    return parseFloat((balance / 100000000).toString()) + " BSV";
};

module.exports = {
    createAddress,
    getAddressFromWIF,
    createNewMnemonic,
    getNewAddressFromSeed,
    getAddressFromSeedAndIndex,
    sendToAddress,
    getBlockTransactions,
    getAddressBalance,
};