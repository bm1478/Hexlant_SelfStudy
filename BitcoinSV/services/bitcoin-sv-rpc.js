const axios = require('axios');
const host = '49.50.164.142';
const port = '8332';

const makeReq = function makeRequest(methodString, ...params) {
  const request = {
    method: 'POST',
    url: 'http://' + host + ':' + port + '/',
    headers: {'Content-Type': 'text/plain'},
    auth: {
      username: 'bitcoin',
      password: 'password',
    },
    data: JSON.stringify({
      jsonrpc: '1.0',
      method: methodString,
      params: params,
    }),
  };
  return request;
};

// 1 비트코인 SV raw transaction
async function getRawTransaction(txId) {
  const result = await axios(makeReq('getrawtransaction', txId));
  return result.data.result;
}

// 1.1 비트코인 SV 트랜잭션 조회
async function getTransactionInfo(txId) {
  const rawTransaction = await getRawTransaction(txId);
  const result = await axios(makeReq('decoderawtransaction', rawTransaction));
  return result.data.result;
};

// 2. 비트코인 SV 밸런스 조회 (account 명시)
async function getBalance(account) {
  const result = await axios(makeReq('getbalance', account));
  return result.data.result;
};

// 2.1 비트코인 SV 네트워크 밸런스 조회
async function getTotalBalance() {
  const result = await axios(makeReq('getbalance'));
  return result.data.result;
}

// 3. 현재 싱킹된 마지막 블록 가져오기
async function getLastBlockNumber() {
  const result = await axios( makeReq('getblockcount'));
  return result.data.result;
};

// 3.2 현재 싱킹된 마지막 블록 정보 가져오기
async function getLastBlockInfo() {
  const lastBlockNumber = await getLastBlockNumber();
  const getHashResult = await axios(makeReq('getblockhash', lastBlockNumber));
  const lastBlockHash = getHashResult.data.result;;
  const result = await axios(makeReq('getblock', lastBlockHash));
  return result.data.result;
};

// 3.3 블록 정보 가져오기
async function getBlockInfo(blockIndex) {
  const getHashResult = await axios(makeReq('getblockhash', blockIndex));
  const blockHash = getHashResult.data.result;
  const result = await axios(makeReq('getblock', blockHash));
  return result.data.result;
};

// 4. send raw transaction
async function sendRawTransaction(rawTx) {;
  const result = await axios(makeReq('sendrawtransaction', rawTx));
  return result.data.result;
};

// 5. decode raw transaction
async function decodeRawTransaction(rawTx) {
  const result = await axios(makeReq('decoderawtransaction', rawTx));
  return result.data.result;
}

module.exports = {
  getRawTransaction,
  getTransactionInfo,
  getBalance,
  getTotalBalance,
  getLastBlockNumber,
  getLastBlockInfo,
  getBlockInfo,
  sendRawTransaction,
  decodeRawTransaction,
};
