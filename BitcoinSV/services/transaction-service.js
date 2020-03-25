const bsv = require('bsv');
const bitcoinSVRPC = require('./bitcoin-sv-rpc');
const {utxos, addresses}= require('../models');
const {getAddressFromSeedAndIndex} = require('./address-service');
const fs = require('fs');

// 1. To find spendable utxo
async function findUtxo(dest, amountToSatoshis, feePerKbOfSatoshis, multiSigOutFlag) {
  // Greedy Algorithm 사용 위해 정렬해서 query
  const sqlResultSet = await utxos.findAll({
    where: {
      spent_flag: false,
    },
    order: [['satoshis', 'DESC'],],
  });
  const utxoSet = [];
  for (const sqlResult of sqlResultSet) {
    utxoSet.push(sqlResult.dataValues);
  }
  if (utxoSet.length >= 1) {
    let totalSatoshis = 0;
    const utxoId = [];
    const txIns = [];
  
    let available = false;
    let utxoIndex = 0;
    
    for (let i = 0; i < utxoSet.length; i++) {
      const utxo = utxoSet[i];
      // id = 트랜잭션 생성하면 database에 있는 utxo 쓰지 못하게 하기 위함, 대신 트랜잭션이 확인이 선택받지 못함이 지속될 때 어떻게 처리할것인지 생각
      const id = utxo.id;
      const address = utxo.address;
      const txId = utxo.tx_id;
      const outputIndex = utxo.output_index;
      const satoshis = utxo.satoshis;
    
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
        utxoIndex = i + 1;
        break;
      }
    }
  
    if(available) {
      let transaction;
      if (multiSigOutFlag) {
        transaction = new bsv.Transaction()
          .from(txIns)
          .addOutput(new bsv.Transaction.Output({
            script: bsv.Script.buildMultisigOut(dest, 2),
            satoshis: amountToSatoshis
          }))
          .feePerKb(feePerKbOfSatoshis)
          .change(txIns[0].address);
      } else {
        transaction = new bsv.Transaction()
          .from(txIns)
          .to(dest, amountToSatoshis)
          .feePerKb(feePerKbOfSatoshis)
          .change(txIns[0].address);
      }
  
      const fee = transaction.getFee();
      // 사용하고자 하는 utxo 합이 fee 합친 것보다 작을 경우 다시 한번 utxo 를 찾아줌.
      while (totalSatoshis < amountToSatoshis + fee) {
        if (utxoIndex === utxoSet.length) {
          return 'No Spendable UTXOs - Fee';
        }
        const utxo = utxoSet[sqlIndex];
        const id = utxo.id;
        const address = utxo.address;
        const txId = utxo.tx_id;
        const outputIndex = utxo.output_index;
        const satoshis = utxo.satoshis;
    
        totalSatoshis += satoshis;
        utxoId.push(id);
        txIns.push({
          address: address,
          txId: txId,
          outputIndex: outputIndex,
          script: bsv.Script.buildPublicKeyHashOut(address).toString(),
          satoshis: satoshis,
        });
        utxoIndex += 1;
      }
      return [utxoId, txIns];
    }
  }
  else {
    return 'No Available UTXOs';
  }
}

// 2. To find private Key set for utxo unlock (single signature 만 가능)
async function findPrivateKeySet(txIns, netParameter) {
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
  
  return privateKeySet;
}

// 1. 전송 (일반 서명 -> 일반 서명 / 다중 서명) 구현 완료 / 한번에 여러명한테 보내는 것도 구현해야 할듯.
// 다중 서명이면 dest 에 pubKeySet 넣고 toThreshold 2 이상, multiSigOutFlag true.
async function sendTo(dest, amount, feeBlock, netParameter, toThreshold, multiSigOutFlag) {
  let transaction;
  const amountToSatoshis = parseInt((amount * 100000000).toString());
  const feePerKbOfSatoshis = parseInt((await bitcoinSVRPC.estimateFee(feeBlock) * 100000000).toString());
  const findUtxoResult = await findUtxo(dest, amountToSatoshis, feePerKbOfSatoshis, multiSigOutFlag);
  const utxoId = findUtxoResult[0];
  const txIns = findUtxoResult[1];
  const privateKeySet = await findPrivateKeySet(txIns, netParameter);
  
  // 다중 서명으로 보내는 경우
  if(multiSigOutFlag) {
    transaction = new bsv.Transaction()
      .from(txIns)
      .addOutput(new bsv.Transaction.Output({
        script: bsv.Script.buildMultisigOut(dest, toThreshold),
        satoshis: amountToSatoshis
      }))
      .feePerKb(feePerKbOfSatoshis)
      .change(txIns[0].address)
      .sign(privateKeySet);
  }
  // 일반 서명
  else {
    transaction = new bsv.Transaction()
      .from(txIns)
      .to(dest, amountToSatoshis)
      .feePerKb(feePerKbOfSatoshis)
      .change(txIns[0].address)
      .sign(privateKeySet);
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

// 2. Transaction input = multisig utxo
async function sendBSVFromMultisig(dest, txId, amount, privateKeySet, toThreshold, multiSigOutFlag, feeBlock, netParameter) {
  const multisigUtxoInfo = await bitcoinSVRPC.getTransactionInfo(txId);
  const voutList = multisigUtxoInfo.vout;
  let satoshis;
  let outputIndex;
  let fromThreshold;
  const pubKeySet = [];
  for (let i = 0; i<voutList.length; i++) {
    if(voutList[i].scriptPubKey.type === "multisig") {
      satoshis = voutList[i].value * 100000000;
      const asm = voutList[i].scriptPubKey.asm;
      const asmList = asm.split(" ");
      for(let j = 0; j < asmList.length; j++) {
        if(j !== 0 && j !== asmList.length - 2 && j !== asmList.length - 1) {
          pubKeySet.push(asmList[j]);
        }
      }
      outputIndex = voutList[i].n;
      fromThreshold = voutList[i].scriptPubKey.reqSigs;
      break;
    }
  }
  
  const amountToSatoshis = amount * 100000000;
  const feePerKbOfSatoshis = parseInt((await bitcoinSVRPC.estimateFee(feeBlock) * 100000000).toString());
  const fromAddress = bsv.Address.fromPublicKey(bsv.PublicKey.fromString(pubKeySet[0]), netParameter).toString();
  const multisigUtxos = {
    address: fromAddress,
    txId: txId,
    outputIndex: outputIndex,
    script: bsv.Script.buildMultisigOut(pubKeySet, fromThreshold),
    satoshis: satoshis
  };
  
  let transaction;
  // multi sign -> multi sign
  if(multiSigOutFlag) {
    transaction = new bsv.Transaction()
      .from(multisigUtxos, pubKeySet, fromThreshold)
      .addOutput(new bsv.Transaction.Output({
          script: bsv.Script.buildMultisigOut(dest, toThreshold),
          satoshis: amountToSatoshis
      }))
      .feePerKb(feePerKbOfSatoshis)
      .change(fromAddress)
      .sign(privateKeySet);
  }
  // multi sign -> normal sign
  else {
    transaction = new bsv.Transaction()
      .from(multisigUtxos, pubKeySet, fromThreshold)
      .to(dest, amountToSatoshis)
      .feePerKb(feePerKbOfSatoshis)
      .change(fromAddress)
      .sign(privateKeySet);
  
  }
  
  if(privateKeySet.length < fromThreshold) {
    return transaction;
  }
  
  const rawTx = transaction.serialize(true);
  const result = await bitcoinSVRPC.sendRawTransaction(rawTx);
  console.log(result);
  return await bitcoinSVRPC.decodeRawTransaction(rawTx);
}

// 3. sign 된 트랜잭션 받아서 한번 더 서명 후 전송
async function signSignedTransaction(signedTransaction, privateKey) {
  const rawTx = signedTransaction.sign(privateKey).serialize(true);
  const result = await bitcoinSVRPC.sendRawTransaction(rawTx);
  console.log(result);
  return await bitcoinSVRPC.decodeRawTransaction(rawTx);
}

module.exports = {
  sendTo,
  sendBSVFromMultisig,
  signSignedTransaction,
};