const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const bsvRPC = require('../services/bitcoin-sv-rpc');
const bsv = require('../services/bsv-module');

router.get('/', function(req, res) {
  res.send('Welcome to BSV-API');
});

// 1. 트랜잭션 조회 요청
/* router.get('/getTransaction', function(req, res) {
  res.render('transaction', {title: 'getTransaction'});
});*/

// 1.1 트랝잭션 정보
router.post('/getTransaction', async function(req, res) {
  if(req.body.txId === undefined) {
    res.send("Need JSON Body - txId");
  }
  const txId = req.body.txId;
  if(txId === "") {
    res.send("Transaction ID is blank");
  }
  const result = await bsvRPC.getTransactionInfo(txId);
  res.send(result);
});

// 2. 밸런스 조회
router.get('/getBalance', async function(req, res) {
  const result = await bsvRPC.getTotalBalance();
  res.send(`Server's Total Balance: ${result}`);
});

// 2.1 account 밸런스 조회
router.get('/getBalance/:account', async function(req, res) {
  if(account === undefined) {
    res.redirect('/getBalance');
  }
  const account = req.params.account;
  const result = await bsvRPC.getBalance(account);
  res.send(`Account ${account}'s balance: ` + result);
});

// 2.2 address 밸런스 조회
router.post('/getAddressBalance', async function(req, res) {
  if(req.body.address === undefined) {
    res.send("Need JSON Body - address");
  }
  const address = req.body.address;
  if(address === "") {
    res.send("Address is blank");
  }
  const result = await bsv.getAddressBalance(address);
  res.send(address + "'s balance: " + result);
});

// 3. 싱킹된 마지막 블록
router.get('/getLastBlockNumber', async function(req, res) {
  const result = await bsvRPC.getLastBlockNumber();
  res.send("Last Block Number: " + result);
});

// 3.1 싱킹된 마지막 블록 정보
router.get('/getLastBlockInfo', async function(req, res) {
  const result = await bsvRPC.getLastBlockInfo();
  res.send(result);
});

// 4. 비트코인 전송해보기
/* router.get('/sendBSV', function(req, res) {
  res.render('send', {title: 'sendBSV'});
});*/

router.post('/sendBSV', async function(req, res) {
  if(req.body.fromAddress === undefined || req.body.fromPrivateKey === undefined
  || toAddress === undefined || amount === undefined)
  {
    res.send("Need JSON Body - fromAddress, fromPrivateKey, toAddress and amount");
  }
  const fromAddress = req.body.fromAddress;
  const fromPrivateKey = req.body.fromPrivateKey;
  const toAddress = req.body.toAddress;
  const amount = parseFloat(req.body.amount);
  const result = await bsv.sendToAddress(fromAddress, fromPrivateKey, toAddress, amount);
  res.send(result);
});

// 5. 기존 seed 로부터 address 만들기
/* router.get('/newAddressFromSeed', function(req, res) {
  res.render('new-address', {title: 'newAddress'});
});*/

// 5.1 새 hd address
router.post('/newAddressFromSeed', async function(req, res) {
  if(req.body.fromSeed === undefined || req.body.netParameter === undefined) {
    res.send("Need JSON Body - fromSeed and netParameter");
  }
  const fromSeed = req.body.fromSeed;
  const netParameter = req.body.netParameter;
  const result = await bsv.getNewAddressFromSeed(fromSeed, netParameter);
  res.send(result);
});

// 5.2 새 seed 만들기 기능이 있어야 하는가

// 5.3 기존 seed index 별 address 얻기
/* router.get('/getAddressFromSeed', function(req, res) {
  res.render('get-address', {title: 'getAddress'});
});*/

// 5.4 기존 seed 에서 index 별 address 읽기
router.post('/getAddressFromSeed', async function(req, res) {
  if(req.body.fromSeed === undefined || req.body.index === undefined ||req.body.netParameter === undefined) {
    res.send("Need JSON Body - fromSeed ,index and netParameter");
  }
  const fromSeed = req.body.fromSeed;
  const index = parseInt(req.body.index);
  const netParameter = req.body.netParameter;
  const result = await bsv.getAddressFromSeedAndIndex(fromSeed, index, netParameter);
  res.send(result);
});

module.exports = router;
