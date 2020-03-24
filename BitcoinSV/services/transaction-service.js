const bsv = require('bsv');
const bitcoinSVRPC = require('./bitcoin-sv-rpc');
const {utxos, addresses}= require('../models');
const {getAddressFromSeedAndIndex} = require('./address-service');
const fs = require('fs');

// 5. 전송 (일반 서명 -> 일반 서명 / 다중 서명) 구현 완료 / 한번에 여러명한테 보내는 것도 구현해야 할듯.
// 다중 서명이면 toAddress에 pubKeySet 넣고 multiSigOutFlag true.
async function sendToAddress(toAddress, amount, feeBlock, netParameter, multiSigOutFlag) {
  // Greedy Algorithm 사용 위해 정렬해서 query
  const sqlResultSet = await utxos.findAll({
    where: {
      spent_flag: false,
    },
    order: [['satoshis', 'DESC'],],
  });
  const sqlResults = [];
  for (const sqlResult of sqlResultSet) {
    sqlResults.push(sqlResult.dataValues);
  }
  if (sqlResults.length >= 1) {
    const amountToSatoshis = parseInt((amount * 100000000).toString());
    let totalSatoshis = 0;
    const utxoId = [];
    const txIns = [];
    
    let available = false;
    let sqlIndex = 0;
    
    // To find utxo;
    for (let i = 0; i < sqlResults.length; i++) {
      const sqlResult = sqlResults[i];
      // 트랜잭션 생성하면 database에 있는 utxo 쓰지 못하게 하기 위함
      // 트랜잭션이 확인이 선택받지 못함이 지속될 때 어떻게 처리할것인지
      const id = sqlResult.id;
      const address = sqlResult.address;
      const txId = sqlResult.tx_id;
      const outputIndex = sqlResult.output_index;
      const satoshis = sqlResult.satoshis;
      
      totalSatoshis += satoshis;
      utxoId.push(id);
      txIns.push({
        address: address,
        txId: txId,
        outputIndex: outputIndex,
        script: bsv.Script.buildPublicKeyHashOut(address).toString(),
        satoshis: satoshis,
      });
      
      if(totalSatoshis > amountToSatoshis) {
        available = true;
        sqlIndex = i + 1;
        break;
      }
    }
    
    if(available) {
      const feePerKbOfSatoshis = parseInt((await bitcoinSVRPC.estimateFee(feeBlock) * 100000000).toString());
      let transaction;
      if(multiSigOutFlag) {
        transaction = new bsv.Transaction()
          .from(txIns)
          .addOutput(new bsv.Transaction.Output({
            script: bsv.Script.buildMultisigOut(toAddress, 2),
            satoshis: amountToSatoshis
          }))
          .fee(feePerKbOfSatoshis);
      }
      else {
        transaction = new bsv.Transaction()
          .from(txIns)
          .to(toAddress, amountToSatoshis)
          .fee(feePerKbOfSatoshis);
      }
      
      const fee = transaction.getFee();
      // 사용하고자 하는 utxo 합이 fee 합친 것보다 작을 경우 다시 한번 utxo 를 찾아줌.
      while(totalSatoshis < amountToSatoshis + fee) {
        if(sqlIndex === sqlResults.length) {
          return 'No Spendable UTXOs - Fee';
        }
        const sqlResult = sqlResults[sqlIndex];
        const id = sqlResult.id;
        const address = sqlResult.address;
        const txId = sqlResult.tx_id;
        const outputIndex = sqlResult.output_index;
        const satoshis = sqlResult.satoshis;
        
        totalSatoshis += satoshis;
        utxoId.push(id);
        txIns.push({
          address: address,
          txId: txId,
          outputIndex: outputIndex,
          script: bsv.Script.buildPublicKeyHashOut(address).toString(),
          satoshis: satoshis,
        });
        sqlIndex += 1;
      }
      
      // 사용할 utxo 를 소유하고 있는 주소에 맞는 private key set 추출
      const privateKeySet = [];
      const useAddresses = [];
      for(const txIn of txIns) {
        useAddresses.push(txIn.address);
      }
      const sqlResultSet = await addresses.findAll({
        where: {address: useAddresses},
        attributes: ['key_index']
      });
      const keyIndexSet = [];
      for (const sqlResult of sqlResultSet) {
        keyIndexSet.push(sqlResult.dataValues.key_index);
      }
      
      // 보통 거래 시 seed 를 입력하진 않기 때문에 파일에서 불러옴.
      const data = JSON.parse(fs.readFileSync(__dirname + '/../bip44-seed.json', 'utf-8'));
      const seedData = data["seed"];
      
      // 그래도 이렇게 해서 private Key 불러오는게 맞는지 모르겠음.
      for(const keyIndex of keyIndexSet) {
        const tempResult = await getAddressFromSeedAndIndex(seedData, keyIndex, netParameter);
        privateKeySet.push(tempResult.privateKey);
      }
      
      // 다중 서명으로 보내는 경우
      if(multiSigOutFlag) {
        transaction.change(txIns[0].address).sign(privateKeySet);
      }
      // 일반 서명
      else {
          transaction.change(txIns[0].address).sign(privateKeySet);
      }
      
      const rawTx = transaction.serialize(true);
      try {
        const newTxId = await bitcoinSVRPC.sendRawTransaction(rawTx);
        const txInfo = await bitcoinSVRPC.decodeRawTransaction(rawTx);
        console.log(newTxId);
        await utxos.update({spent_flag: true}, {
          where: {
            id: utxoId,
          },
        });
        return txInfo;
      } catch (err) {
        await utxos.update({spent_flag: false}, {
          where: {
            id: utxoId,
          },
        });
        return err;
      }
    }
    else {
      return 'No Spendable UTXOs';
    }
  }
  else {
    return 'No Available UTXOs';
  }
}

// Transaction input = multisig utxo
async function sendBSVFromMultisig(fromPubKeySet, txId, toAddress, amount, feeBlock, privateKeySet, threshold, multiSigOutFlag) {
  const amountToSatoshis = amount * 100000000;
  const feePerKbOfSatoshis = parseInt((await bitcoinSVRPC.estimateFee(feeBlock) * 100000000).toString());
  const fromAddress = bsv.Address.fromPublicKey(bsv.PublicKey.fromString(fromPubKeySet[0]), 'testnet').toString();
  const multisigUtxos = {
    address: fromAddress,
    txId: txId,
    outputIndex: 0,
    script: bsv.Script.buildMultisigOut(fromPubKeySet, threshold),
    satoshis: 0.001 * 100000000 // 사토시 양 현재 하드코
  };
  
  let transaction;
  // multi sign -> multi sign
  if(multiSigOutFlag) {
    transaction = new bsv.Transaction()
      .from(multisigUtxos, fromPubKeySet, threshold)
      .addOutput(new bsv.Transaction.Output({
          script: bsv.Script.buildMultisigOut(toAddress, threshold),
          satoshis: amountToSatoshis
      }))
      .feePerKb(feePerKbOfSatoshis)
      .change(fromAddress)
      .sign(privateKeySet);
    
    if(privateKeySet.length < threshold) {
      return transaction;
    }
  }
  // multi sign -> normal sign
  else {
      transaction = new bsv.Transaction()
        .from(multisigUtxos, fromPubKeySet, threshold)
        .to(toAddress, amountToSatoshis)
        .feePerKb(feePerKbOfSatoshis)
        .change(fromAddress)
        .sign(privateKeySet);
  
    if(privateKeySet.length < threshold) {
      return transaction;
    }
  }
  const rawTx = transaction.serialize(true);
  return await bitcoinSVRPC.decodeRawTransaction(rawTx);
}

// sign 된 트랜잭션 받아서 한번 더 서명 후 전송
async function signSignedTransaction(signedTransaction, privateKey) {
  // console.log(signedTransaction.inputs);
  // const tx = signedTransaction.toBuffer().toString('hex');
  // console.log(new bsv.Transaction(tx).inputs);
  const rawTx = signedTransaction.sign(privateKey).serialize(true);
  return await bitcoinSVRPC.decodeRawTransaction(rawTx);
}

module.exports = {
  sendToAddress,
  sendBSVFromMultisig,
  signSignedTransaction,
};