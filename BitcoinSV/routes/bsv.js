const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const bsvRPC = require('../services/bitcoin-sv-rpc');
require('../services/bsv-service');
const addressService = require('../services/address-service');
const transactionService = require('../services/transaction-service');

router.get('/', function(req, res) {
  res.send('Welcome to BSV-API');
});

// 1. 트랜잭션 조회 요청
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
  if(req.params.account === undefined) {
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
  const result = await addressService.getAddressBalance(address);
  res.send(`Address ${address}'s balance: ${result}`);
});

// 2.3 My All Address 밸런스 조회
router.get('/getMyBalance', async function(req, res) {
  const result = await addressService.getMyBalance();
  res.send(`My Balance: ${result}`);
});

// 3. 싱킹된 마지막 블록
router.get('/getLastBlockNumber', async function(req, res) {
  const result = await bsvRPC.getLastBlockNumber();
  res.send(`Last Block Number: ${result}`);
});

// 3.1 싱킹된 마지막 블록 정보
router.get('/getLastBlockInfo', async function(req, res) {
  const result = await bsvRPC.getLastBlockInfo();
  res.send(result);
});

// 4. 새 hd address
router.post('/newAddressFromSeed', async function(req, res) {
  if(req.body.fromSeed === undefined || req.body.netParameter === undefined) {
    res.send("Need JSON Body - fromSeed and netParameter");
  }
  const fromSeed = req.body.fromSeed;
  const netParameter = req.body.netParameter;
  const result = await addressService.getNewAddressFromSeed(fromSeed, netParameter);
  res.send(result);
});

// 4.1 새 seed 만들기 기능이 있어야 하는가
// 4.2 기존 seed 에서 index 별 address 읽기
router.post('/getAddressFromSeed', async function(req, res) {
  if(req.body.fromSeed === undefined || req.body.index === undefined ||req.body.netParameter === undefined) {
    res.send("Need JSON Body - fromSeed, index and netParameter");
  }
  const fromSeed = req.body.fromSeed;
  const index = parseInt(req.body.index);
  const netParameter = req.body.netParameter;
  const result = await addressService.getAddressFromSeedAndIndex(fromSeed, index, netParameter);
  res.send(result);
});

// 4. 비트코인 전송해보기 - only from normal sig -> to normal and multi
router.post('/sendBSV', async function(req, res) {
  if(req.body.dest === undefined || req.body.amount === undefined || req.body.netParameter === undefined) {
    res.send("Need JSON Body - dest, amount, feeBlock(option, default = 6)," +
      " netParameter toThreshold(option, default 1) and multiSigOutFlag(option, default = false)");
  }
  const dest = req.body.dest;
  const amount = parseFloat(req.body.amount);
  let feeBlock = 6;
  if(!(req.body.feeBlock === undefined)) {
    feeBlock = parseInt(req.body.feeBlock);
  }
  const netParameter = req.body.netParameter;
  let toThreshold = 1;
  if(!(req.body.toThreshold === undefined)) {
    toThreshold = req.body.toThreshold;
  }
  let multiSigOutFlag = false;
  if(!(req.body.multiSigOutFlag === undefined)) {
    multiSigOutFlag = req.body.multiSigOutFlag;
  }
  const result = await transactionService.sendTo(dest, amount, feeBlock, netParameter, toThreshold, multiSigOutFlag);
  res.send(result);
});

module.exports = router;
