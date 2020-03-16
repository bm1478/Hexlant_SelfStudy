// 1. 비트코인SV 트랜잭션 조회
// 2. 비트코인SV 밸런스 조회
// 3. 현재 싱킹된 마지막 블록 가져오기
// 4. 비트코인SV 전송해보기

const express = require('express');
const router = express.Router();
const bsvRPC = require('../../bitcoin-sv-rpc');
const bsvModule = require('../../bsv-module');

router.get('/', function(req, res) {
    res.send('Welcome to BSV-API');
})

// 1. 트랜잭션 조회
router.get('/getTransaction/:txId', function(req, res) {
    let txId = req.params.txId;
    bsvRPC.getTransactionInfo(txId).then(result => {
        res.json(result);
    });
});

// 2. 밸런스 조회
router.get('/getBalance', function(req, res) {
    bsvRPC.getTotalBalance().then(result => {
        res.send(result);
    })
});

// 2.1 account 밸런스 조회
router.get('/getBalance/:account', function(req, res) {
    let account = req.params.account;
    bsvRPC.getBalance(account).then(result => {
        res.send(result);
    })
});

// 2.2 address 밸런스 조회
router.get('/getAddressBalance/:address', function(req, res) {
    let address = req.params.address;
    bsvModule.getAddressBalance(address).then(result => {
        res.send(result);
    })
});

// 3. 싱킹된 마지막 블록
router.get('/getLastBlock', function(req, res) {
    bsvRPC.getSyncLastBlock().then(result => {
        res.render("info", {title:'getLastBlock', result: result});
    });
});

// 3.1 싱킹된 마지막 블록 정보
router.post('/getLastBlock', function (req, res) {
    bsvRPC.getSyncLastBlockInfo().then(result => {
        res.send(result);
    });
});

// 4. 비트코인 전송해보기
router.get('/sendBSV', function (req, res) {
    res.render("send", {title: 'sendBSV'});
});

router.post('/sendBSV', function(req, res) {
    let fromAddress = req.body.fromAddress;
    let fromPrivateKey = req.body.fromPrivateKey;
    let toAddress = req.body.toAddress;
    let amount = parseFloat(req.body.amount);
    bsvModule.sendToAddress(fromAddress, fromPrivateKey, toAddress, amount).then(result => {
        res.send(result);
    })
});

// 5. 기존 seed 로부터 address 만들기
router.get('/newAddressFromSeed', function (req, res) {
    res.render("newAddress", {title: 'newAddress'});
});

router.post('/newAddressFromSeed', function (req, res) {
    let fromSeed = req.body.fromSeed;
    let netParameter = req.body.netParameter;
    bsvModule.getNewAddressFromSeed(fromSeed, netParameter).then(result => {
        res.send(result);
    });
});

// 6. 기존 seed index 별 address 얻기
router.get('/getAddressFromSeed', function (req,res) {
    res.render("getAddress", {title: 'getAddress'});
});

router.post('/getAddressFromSeed', function (req, res) {
    let fromSeed = req.body.fromSeed;
    let netParameter = req.body.netParameter;
    let index = req.body.index;
    bsvModule.getAddressFromSeedAndIndex(fromSeed, index, netParameter).then(result=> {
        res.send("Your " + index + "th Address: " + result.hdAddress);
    });
});

// 7. Block Index 별 정보 가져오기
router.get('/getBlockInfo/:index', function(req, res) {
    let blockIndex = parseInt(req.params.index);
    bsvModule.getBlockTransactions(blockIndex).then(result => {
        res.send(result);
    });
});

module.exports = router;