const axios = require('axios');
const host = '49.50.164.142';
const port = '8332';

let makeReq = function makeRequest(methodString, ...params) {
    let request = {
        method: 'POST',
        url: 'http://' + host + ':' + port + '/',
        headers: {'Content-Type': 'text/plain'},
        auth: {
            //username:'beoms',
            username: 'bitcoin',
            password: 'password'
        },
        data: JSON.stringify({
            jsonrpc: '1.0',
            method: methodString,
            params: params,
        })
    };
    return request;
};

// 1. 비트코인SV 트랜잭션 조회
async function getTransactionInfo(txId) {
    let getTransactionInfoRequest = makeReq('getrawtransaction', txId);
    let semi_result = await axios(getTransactionInfoRequest);
    let rawTransaction = semi_result.data.result
    let decodeRawTransactionRequest = makeReq('decoderawtransaction', rawTransaction);
    let result = await axios(decodeRawTransactionRequest);
    return (result.data.result);
};

// 2. 비트코인 SV 밸런스 조회 (account 명시)
async function getBalance(account) {
    let getBalanceRequest = makeReq('getbalance', account);
    let result = await axios(getBalanceRequest);
    return ('Account ' + account + "'s balance: " + result.data.result);
};

// 2.1 비트코인 SV 네트워크 밸런스 조회
async function getTotalBalance() {
    let getTotalBalanceRequest = makeReq('getbalance');
    let result = await axios(getTotalBalanceRequest);
    return ('Network balance: ' + result.data.result);
}

// 3. 현재 싱킹된 마지막 블록 가져오기
async function getSyncLastBlock() {
    let getLastBlockRequest = makeReq('getblockcount');
    let result = await axios(getLastBlockRequest);
    return ('Last Block Number: '+ result.data.result);
};

// 3.2 현재 싱킹된 마지막 블록 정보 가져오기
async function getSyncLastBlockInfo() {
    let lastBlockHash = '';
    await axios(makeReq("getbestblockhash")).then(result => lastBlockHash = result.data.result);
    let getSyncLastBlockInfoRequest = makeReq('getblock', lastBlockHash);
    let result = await axios(getSyncLastBlockInfoRequest);
    return (result.data.result);
};

// 3.3 블록 정보 가져오기
async function getBlockInfo(blockIndex) {
    let getBlockHashRequest = makeReq('getblockhash', blockIndex);
    let semi_result = await axios(getBlockHashRequest);
    let blockHash = semi_result.data.result;
    let getBlockRequest = makeReq('getblock', blockHash);
    let result = await axios(getBlockRequest);
    return (result.data.result);
};

// 7. send raw transaction
async function sendRawTransaction(rawTx) {
    let sendRawTransactionRequest = makeReq('sendrawtransaction', rawTx);
    let result = await axios(sendRawTransactionRequest);
    return (result.data.result);
};

// 8. decode raw transaction
async function decodeRawTransaction(rawTx) {
    let decodeRawTransactionRequest = makeReq('decoderawtransaction', rawTx);
    let result = await(axios(decodeRawTransactionRequest));
    return (result.data.result);
}

module.exports = {
    getTransactionInfo,
    getBalance,
    getTotalBalance,
    getSyncLastBlock,
    getSyncLastBlockInfo,
    getBlockInfo,
    sendRawTransaction,
    decodeRawTransaction,
};