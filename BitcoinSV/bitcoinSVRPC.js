const axios = require('axios');

const host = '127.0.0.1';
//const host = '192.168.0.67';
//const host = '49.50.164.142';
const port = '8332';

let makeReq = function makeRequest(methodString, ...params) {
    let request = {
        method: 'POST',
        url: 'http://' + host + ':' + port + '/',
        headers: {'Content-Type': 'text/plain'},
        auth: {
            username:'beoms',
            //username: 'bitcoin',
            password: 'password'
        },
        data: JSON.stringify({
            jsonrpc: '1.0',
            method: methodString,
            params: params
        })
    };
    return request;
};

axios(makeReq('getblockcount')).then(result => {
    console.log(result.data.result);
});

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
}

// 4. 비트코인 SV 전송해보기
async function sendBSV(fromAccount, toAddress, amount) {
    let sendBSVRequest = makeReq('sendfrom', fromAccount, toAddress, amount);
    let result = await axios(sendBSVRequest);
    return ('TX ID: ' + result.data.result);
};

// 5. 비트코인 주소 잔액확인
async function getListReceivedByAddress() {
    let getListRecievedByAddressRequest = makeReq('listreceivedbyaddress');
    let result = await axios(getListRecievedByAddressRequest);
    return (result.data.result);
};

// 6. UTXO 추출
async function getUTXO(txId, index) {
    let getUTXORequest = makeReq('gettxout', txId, index);
    let result = await axios(getUTXORequest);
    return (result.data.result);
}

// 7. send raw transaction
async function sendRawTransaction(rawTx) {
    let sendRawTransactionRequest = makeReq('sendrawtransaction', rawTx);
    let result = await axios(sendRawTransactionRequest);
    return (result.data.result);
}

module.exports = {
    getTransactionInfo,
    getBalance,
    getSyncLastBlock,
    getSyncLastBlockInfo,
    sendBSV,
    getListReceivedByAddress,
    getUTXO,
    sendRawTransaction,
};