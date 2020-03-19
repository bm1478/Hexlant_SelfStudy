const bsv = require('bsv');
const Mnemonic = require('bsv/mnemonic');
const bitcoinSVRPC = require('./bitcoin-sv-rpc');
// first, Do "sequelize init"
const {sequelize, Sequelize, utxos, addresses}= require('../models');
const fs = require('fs');

// 1. 주소 생성
// p2pkh (pay to public key hash)
function createAddress(netParameter) {
  const privateKey = bsv.PrivateKey.fromRandom(netParameter);
  const publicKey = bsv.PublicKey.fromPrivateKey(privateKey);
  const address = bsv.Address.fromPublicKey(publicKey, netParameter);
  const result = {
    privateKeyWIF: privateKey.toWIF(),
    publicKey: publicKey.toString(),
    address: address.toString(),
  };
  return result;
};

// 1.1 주소 반환
function getAddressFromWIF(privateKeyWIF, netParameter) {
  const privateKey = bsv.PrivateKey.fromWIF(privateKeyWIF);
  const publicKey = bsv.PublicKey.fromPrivateKey(privateKey);
  const address = bsv.Address.fromPrivateKey(privateKey, netParameter);
  const result = {
    privateKeyWIF: privateKey.toWIF(),
    publicKey: publicKey.toString(),
    address: address.toString(),
  };
  return result;
};

// Connect localhost Database
async function connectDB() {
  try {
    await sequelize.sync();
  } catch (err) {
    return err;
  }
};

// 2.1 Create New Mnemonic
function createNewMnemonic() {
  const mnemonic = Mnemonic.fromRandom();
  const obj = JSON.stringify({"seed": mnemonic.toString()});
  fs.appendFileSync(__dirname + '/../bip44-seed.json', obj, 'utf-8');
  return mnemonic.toString();
};

// 2.2 새 hd 주소 생성 - seed 를 파일로 가지고 있는데, seed 에 대한 정보를 어디서 넘겨줄지 정해야함.
// 로그인 후 세션 유지하면서 seed 를 읽어와 전달할건지 - 이러면 bsv.js 에서 seed 읽어와야함.
// 새 주소 생성할 때마다 제공할 것인지
// 일단은 주소 생성마다
async function getNewAddressFromSeed(seed, netParameter) {
  const mnemonic = Mnemonic.fromString(seed);
  const rootHdPrivateKey = bsv.HDPrivateKey.fromSeed(mnemonic.toSeed(), netParameter);
  await connectDB();
  const seedCount = await addresses.count();
  const data = JSON.parse(fs.readFileSync(__dirname + '/../bip44-path.json', 'utf-8'));
  const pathData = data["path"]
  const newPath = pathData + seedCount.toString();
  const newHdPrivateKey = rootHdPrivateKey.deriveChild(newPath);
  const privateKey = newHdPrivateKey.privateKey;
  const publicKey = newHdPrivateKey.publicKey.toString();
  const hdAddress = bsv.Address.fromPrivateKey(privateKey, netParameter);
  try {
    addresses.create({
      address: hdAddress.toString(),
      key_index: seedCount,
    });
  } catch (err) {
    return err;
  }
  const result = {
    privateKey: privateKey.toString(),
    publicKey: publicKey.toString(),
    hdAddress: hdAddress.toString(),
  };
  return result;
};

// 2.3 hd 주소 반환
async function getAddressFromSeedAndIndex(seed, index, netParameter) {
  const mnemonic = Mnemonic.fromString(seed);
  const rootHdPrivateKey = bsv.HDPrivateKey.fromSeed(mnemonic.toSeed(), netParameter);
  await connectDB();
  const seedCount = await addresses.count();
  if (index+1 > seedCount) {
    return 'Invalid Index.';
  }
  const data = JSON.parse(fs.readFileSync(__dirname + '/../bip44-path.json', 'utf-8'));
  const pathData = data["path"]
  const getPath = pathData + index.toString();
  const getHdPrivateKey = rootHdPrivateKey.deriveChild(getPath);
  const privateKey = getHdPrivateKey.privateKey;
  const publicKey = getHdPrivateKey.publicKey.toString();
  const hdAddress = bsv.Address.fromPrivateKey(privateKey, netParameter);
  const result = {
    privateKey: privateKey.toString(),
    publicKey: publicKey.toString(),
    hdAddress: hdAddress.toString(),
  };
  return result;
};

// 3. 주소 balance (database utxo)
async function getAddressBalance(myAddress) {
  await connectDB();
  const sqlResultSet = await utxos.findAll({
    where: {
      address: myAddress,
    },
  });
  let balance = 0;
  for (const sqlResult of sqlResultSet) {
    if (!sqlResult.spent_flag) {
      balance += sqlResult.satoshis;
    }
  }
  return parseFloat((balance / 100000000).toString());
};

// 4. Save UTXO From TxId - tx 에서 utxo 저장하기 (기존 쌓인 블록에서 추출한 트랜잭션)
// 내 주소와 연관된 utxo 만 추출
async function saveUTXOFromTxID(txId) {
  await connectDB();
  const rpcResult = await bitcoinSVRPC.getTransactionInfo(txId);
  const utxoList = [];
  const vinList = rpcResult.vin;
  const voutList = rpcResult.vout;
  
  let sqlResultSet = await addresses.findAll({attributes: ['address']});
  const addressSet = [];
  for (const sqlResult of sqlResultSet) {
    addressSet.push(sqlResult.dataValues.address);
  }
  
  // 트랜잭션이 coinbase transaction 이 아닌 경우 (vin 존재할 경우) vin 확인
  if(!vinList[0].hasOwnProperty("coinbase")) {
    sqlResultSet = await utxos.findAll({attributes: ['tx_id', 'output_index']});
    const utxoSet = [];
    for(const sqlResult of sqlResultSet) {
      const txId = sqlResult.dataValues.tx_id;
      const outputIndex = sqlResult.dataValues.output_index;
      const dbUtxo = {
        txId: txId.toString(),
        outputIndex: parseInt(outputIndex)
      };
      utxoSet.push(dbUtxo);
    }
    
    // 트랜잭션 vin 리스트 만들고 사용한 utxo 있나 set 에서 확인
    for (const vin of vinList) {
      const tempTxId = vin.txid;
      const tempVout = vin.vout;
      const tempVin = {
        txId: tempTxId.toString(),
        outputIndex: parseInt(tempVout)
      };
      if(utxoSet.includes(tempVin)) {
        await utxos.update({spent_flag: true}, {
          where: {
            tx_id: tempVin.txId,
            output_index: tempVin.outputIndex
          }
        });
      }
    }
  }
  
  // 트랜잭션이 정상적으로 이루어지고, address가 포함된 transaction 만 push
  for (let i = 0; i < voutList.length; i++) {
    if(voutList[i].scriptPubKey.type === "pubkeyhash") {
      const voutAddress = voutList[i].scriptPubKey.addresses[0];
      if(addressSet.includes(voutAddress)) {
        const tempUtxo = {
          address: voutAddress,
          outputindex: i,
          satoshis: voutList[i].value * 100000000,
        };
        utxoList.push(tempUtxo);
      }
    }
  }

  for (let i=0; i<utxoList.length; i++) {
    try {
      utxos.create({
        address: utxoList[i].address,
        tx_id: txId,
        output_index: utxoList[i].outputindex,
        satoshis: utxoList[i].satoshis,
        spent_flag: false,
      });
    } catch (err) {
      return err;
    };
  }
  return 'Success';
};

// 4.2 Block 별 utxo 뽑기
async function getBlockTransactions(blockIndex) {
  const blockInfo = await bitcoinSVRPC.getBlockInfo(blockIndex);
  const txList = blockInfo.tx;
  for (const tx of txList) {
    await saveUTXOFromTxID(tx);
  }
  return 'Success';
};

// 5. 전송
async function sendToAddress(fromAddress, fromPrivateKey, toAddress, amount) {
  await connectDB();
  const Op = Sequelize.Op;
  const fee = 400;
  const sqlResultSet = await utxo.findAll({
    where: {
      address: fromAddress,
      satoshis: {
        [Op.gte]: amount * 100000000 + fee,
      },
      spent_flag: false,
    },
  });
  // 가장 위에 있는 utxo 부터 사용.
  if (sqlResultSet.length >= 1) {
    const sqlResult = sqlResultSet[0];
    const id = sqlResult.id;
    const txId = sqlResult.tx_id;
    const outputIndex = sqlResult.output_index;
    const satoshis = sqlResult.satoshis;
    const utxos = {
      address: fromAddress,
      txId: txId,
      outputIndex: outputIndex,
      script: bsv.Script.buildPublicKeyHashOut(fromAddress).toString(),
      satoshis: satoshis,
    };
    const amountOfSathoshis = parseInt((amount * 100000000).toString());
    const transaction = new bsv.Transaction()
        .from(utxos)
        .to(toAddress, amountOfSathoshis)
        .fee(fee)
        .change(fromAddress)
        .sign(fromPrivateKey);

    const rawTx = transaction.serialize(true);
    // 여기 고치
    try {
      bitcoinSVRPC.decodeRawTransaction(rawTx).then((result) => {
        console.log(result);
      });
      bitcoinSVRPC.sendRawTransaction(rawTx).then((newTxId) => {
        // 사용 완료하면 UTXO로 저장, 사용한 UTXO는 is_spent = true,
        // 새로 생긴 UTXO는 is_spent = false
        utxos.update({spent_flag: true}, {
          where: {
            id: id,
          },
        });
        saveUTXOFromTxID(newTxId);
      });
    } catch (err) {
      return err;
    }
    return 'Success';
  }
  else {
    return 'No Available UTXOs';
  }
};

module.exports = {
  createAddress,
  getAddressFromWIF,
  createNewMnemonic,
  getNewAddressFromSeed,
  getAddressFromSeedAndIndex,
  saveUTXOFromTxID,
  sendToAddress,
  getBlockTransactions,
  getAddressBalance,
};
