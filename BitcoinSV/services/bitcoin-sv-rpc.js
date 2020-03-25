const axios = require('axios');
const host = '49.50.164.142';
const port = '8332';

// Connection pool
const http = require('http');
const https = require('https');
const httpAgent = new http.Agent({keepAlive: true});
const httpsAgent = new https.Agent({keepAlive: true});
const aliveAxios = axios.create({
  timeout: 60000,
  httpAgent,
  httpsAgent,
  maxRedirects: 10,
  maxContentLength: 500 * 1000 * 1000
});

const makeReq = function makeRequest(methodString, ...params) {
  return {
    method: 'POST',
    url: 'http://' + host + ':' + port + '/',
    headers: { 'Content-Type': 'text/plain' },
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
};

// 1 비트코인 SV raw transaction
async function getRawTransaction(txId) {
  const result = await aliveAxios(makeReq('getrawtransaction', txId));
  return result.data.result;
}

// 1.1 비트코인 SV 트랜잭션 조회
async function getTransactionInfo(txId) {
  const rawTransaction = await getRawTransaction(txId);
  const result = await aliveAxios(makeReq('decoderawtransaction', rawTransaction));
  return result.data.result;
}

// 2. 비트코인 SV 밸런스 조회 (account 명시)
async function getBalance(account) {
  const result = await aliveAxios(makeReq('getbalance', account));
  return result.data.result;
}

// 2.1 비트코인 SV 네트워크 밸런스 조회
async function getTotalBalance() {
  const result = await aliveAxios(makeReq('getbalance'));
  return result.data.result;
}

// 3. 현재 싱킹된 마지막 블록 가져오기
async function getLastBlockNumber() {
  const result = await aliveAxios( makeReq('getblockcount'));
  return result.data.result;
}

// 3.2 현재 싱킹된 마지막 블록 정보 가져오기
async function getLastBlockInfo() {
  const lastBlockNumber = await getLastBlockNumber();
  const getHashResult = await aliveAxios(makeReq('getblockhash', lastBlockNumber));
  const lastBlockHash = getHashResult.data.result;
  const result = await aliveAxios(makeReq('getblock', lastBlockHash));
  return result.data.result;
}

// 3.3 블록 정보 가져오기
async function getBlockInfo(blockIndex) {
  const getHashResult = await aliveAxios(makeReq('getblockhash', blockIndex));
  const blockHash = getHashResult.data.result;
  const result = await aliveAxios(makeReq('getblock', blockHash));
  return result.data.result;
}

// 4. send raw transaction
async function sendRawTransaction(rawTx) {
  const result = await aliveAxios(makeReq('sendrawtransaction', rawTx));
  return result.data.result;
}

// 5. decode raw transaction
async function decodeRawTransaction(rawTx) {
  const result = await aliveAxios(makeReq('decoderawtransaction', rawTx));
  return result.data.result;
}

// 6. estimate fee
async function estimateFee(target) {
  const result = await aliveAxios(makeReq('estimatefee', target));
  return result.data.result;
}

// 7. sign raw transaction
async function signRawTransaction(rawTx, privateKey) {
  const pk = [];
  pk.push(privateKey);
  const result = await aliveAxios(makeReq('signrawtransacion', rawTx, null, pk, "ALL|FORKID"));
  return result.data.result;
}

module.exports = {
  getTransactionInfo,
  getBalance,
  getTotalBalance,
  getLastBlockNumber,
  getLastBlockInfo,
  getBlockInfo,
  sendRawTransaction,
  decodeRawTransaction,
  estimateFee,
  signRawTransaction
};
