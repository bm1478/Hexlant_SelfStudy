const bitcoinSVRPC = require('./bitcoin-sv-rpc');
const {utxos, addresses, blocks}= require('../models');
const coinType = "Bitcoin SV";

// 1. Save UTXO From TxId - tx 에서 utxo 저장하기 (기존 쌓인 블록에서 추출한 트랜잭션)
// 내 주소와 연관된 utxo 만 추출 (일반 서명)
async function saveUTXOFromTxID(txId) {
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
    // Database utxo info
    sqlResultSet = await utxos.findAll(
      { where: {spent_flag: false}
      }, {
        attributes: ['tx_id', 'output_index']
      });
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
    
    // 트랜잭션의 vin 리스트 만들고 사용한 utxo 있나 set 에서 확인
    for (const vin of vinList) {
      const tempTxId = vin.txid;
      const tempVout = vin.vout;
      const tempVin = {
        txId: tempTxId.toString(),
        outputIndex: parseInt(tempVout)
      };
      for(const tempUtxo of utxoSet) {
        if(tempVin.txId === tempUtxo.txId && tempVin.outputIndex === tempUtxo.outputIndex) {
          await utxos.update({spent_flag: true}, {
            where: {
              tx_id: tempVin.txId,
              output_index: tempVin.outputIndex
            }
          });
        }
      }
    }
  }
  
  // 트랜잭션이 정상적으로 이루어지고, 내 address가 포함된 transaction 만 db에 push
  for (let i = 0; i < voutList.length; i++) {
    if(voutList[i].scriptPubKey.type === "pubkeyhash") { // 일단 pubkeyhash 만
      const voutAddress = voutList[i].scriptPubKey.addresses[0];
      if(addressSet.includes(voutAddress)) {
        const tempUtxo = {
          address: voutAddress,
          outputindex: voutList[i].n,
          satoshis: voutList[i].value * 100000000,
        };
        utxoList.push(tempUtxo);
      }
    }
  }
  
  for (let i = 0; i<utxoList.length; i++) {
    try {
      await utxos.create({
        address: utxoList[i].address,
        tx_id: txId,
        output_index: utxoList[i].outputindex,
        satoshis: utxoList[i].satoshis,
        spent_flag: false,
      });
    } catch (err) {
      return err;
    }
  }
  return 'Success';
}

// 1.1 Block 별 utxo 뽑기: 이거는 서버 자체적으로 해줘야함. - 스케줄러
async function getBlockTransactions(blockIndex) {
  const blockInfo = await bitcoinSVRPC.getBlockInfo(blockIndex);
  const txList = blockInfo.tx;
  for (const tx of txList) {
    await saveUTXOFromTxID(tx);
  }
  
  if(blockIndex === 1) {
    try {
      await blocks.create({
        coin_type: coinType,
        hash: blockInfo.hash,
        height: blockInfo.height,
      });
    } catch(err) {
      return err;
    }
  }
  else {
    try {
      await blocks.update({
        hash:blockInfo.hash,
        height:blockInfo.height,
      }, {
        where: {coin_type: coinType}
      })
    } catch(err) {
      return err;
    }
  }
  return 'Success';
}

// 1.2 Database 에 싱킹한 블록 정보 가져오고 담기
async function getSyncLastHeight() {
  const isExist = await blocks.count({where: {coin_type: coinType}});
  if(isExist === 0) {
    return 0;
  }
  else {
    const latestHeight = await blocks.findOne({where: {coin_type: coinType}, attributes: ['height']});
    return latestHeight.dataValues.height;
  }
}

module.exports = {
  getBlockTransactions,
  getSyncLastHeight,
};