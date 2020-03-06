const axios = require('axios');

const host = '192.168.0.67';
const port = '8332';

let makeReq = function makeRequest(methodString, ...params) {
    let request = {
        method: 'POST',
        url: 'http://' + host + ':' + port + '/',
        headers: {'Content-Type': 'text/plain'},
        auth: {
            username: 'bitcoin',
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

axios(makeReq("getbalance")).then((result, err)=> {
    console.log('Total Balance: ', result.data.result);
});

axios(makeReq("listreceivedbyaccount")).then((result, err) => {
    if(err)
        console.log(err);
    console.log('Result: ', result.data.result);
});

// 1. 비트코인SV 트랜잭션 조회
async function getTransactionInfo(txId) {
    let getTransactionInfoRequest = makeReq('gettransaction', txId);
    let result = await axios(getTransactionInfoRequest);
    console.log(result.data.result);
    return ('Transaction Info: ' + result.data.result);
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

// 4. 비트코인 SV 전송해보기
async function sendBSV(fromAccount, toAddress, amount) {
    let sendBSVRequest = makeReq('sendfrom', fromAccount, toAddress, amount);
    let result = await axios(sendBSVRequest);
    return ('TX ID: ' + result.data.result);
};

//getBalance("n15XCzN1darrb7a32goRxGT57xgtS4ipTv").then(console.log);
//getBalance("mk4BH1qBfqDrhrUY3eLGwGne2jJY5gZJKb").then(console.log);
//getBalance("n3RZ498sWzqgZ1GoiwkrfUxFRULLC5cyS8").then(console.log);
//getBalance("mgW88hTseTYoabWpu1jZE8rreynJjbFErt").then(console.log);
//getTransactionInfo("2596725e5d02d3f2979b39f82b1865e93dd4372d63aeebf68821f7a4b83444bc").then(console.log);
//getTransactionInfo("a7708701cfc6f9ad2194f074502b40d4a15960e653593fa1908907298b970cd3").then(console.log);
getBalance("mx7Eb8oHaTzrAsX2VaAP6sd3DHxPaeUj62").then(console.log);
getBalance("mzkgPmg5xGQ694xzxVs3LHzoUA3XhVfZHq").then(console.log);
getBalance("beoms").then(console.log);
getSyncLastBlock().then(console.log);
getTransactionInfo("b94f7c639492c64709129cf30e506a6c2d1982f3109cb5c8a48b62f30da43a97").then();
sendBSV("beoms", "mzkgPmg5xGQ694xzxVs3LHzoUA3XhVfZHq", 2000000).then(console.log); //0.02 BSV