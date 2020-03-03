var express = require('express');
var app = express();
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var Tx = require('ethereumjs-tx').Transaction;

const send_account = "0xA65DEBF2b8A3635a8F23ebe7EE080247c97B1F23";
const receive_account = "0x438961DE7cf1a96eBdD56dCdf69aC3Bf64352fc3";
const privateKey = Buffer.from("ff26c419d8a00cab5cf94b5699df074bd5bdec9c05920508d6b9361001b71a55", "hex");

var solc = require('solc');
var fs = require('fs');

app.get('/smartcontract', function(req, res) {
    var source = fs.readFileSync('./contracts/HelloWorld.sol','utf8').toString();

    console.log('transaction...compiling contract .....');
    let compiledContract = solc.compile(source);    // JSON형태로 컴파일
    console.log('done!!' + compiledContract);

    var bytecode = '';
    var abi = '';
    for(let contractName in compiledContract.contracts) {
        abi = JSON.parse(compiledContract.contracts[contractName].interface);
        console.log(abi);
        bytecode = compiledContract.contracts[contractName].bytecode;
        console.log(bytecode);
    }

    const MyContract = new web3.eth.Contract(abi);

    let deploy = MyContract.deploy({
        data: bytecode,
        from: send_account}).encodeABI();

    web3.eth.getTransactionCount(send_account, (err, txCount) => {
        const txObject = {
            nonce: web3.utils.toHex(txCount),
            gasLimit: web3.utils.toHex(1000000),
            gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
            data: '0x' + deploy
        };

        const tx = new Tx(txObject);
        tx.sign(privateKey);

        const serializedTx = tx.serialize();
        const raw = '0x' + serializedTx.toString('hex');

        web3.eth.sendSignedTransaction(raw)
        .once('transactionHash', (hash)=> {
            console.info('transactionHash', 'https://ropsten.etherscan.io/tx/' + hash);
        })
        .once('receipt', (receipt) => {
            console.info('receipt', receipt);
        }).on('error', console.error);

        res.end();
    });
});

app.get('/main', function(req,res) {
    
    web3.eth.getTransactionCount(send_account, (err, txCount) => {
        const txObject = {
            nonce: web3.utils.toHex(txCount),
            gasLimit: web3.utils.toHex(1000000),
            gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
            to: receive_account,
            value: '0x2386f26fc10000' //0.01 이더 전송
        };
    
        const tx = new Tx(txObject);
        tx.sign(privateKey);

        const serializedTx = tx.serialize();
        const raw = '0x' + serializedTx.toString('hex');
    
        web3.eth.sendSignedTransaction(raw)
            .once('transactionHash', (hash)=> {
                console.info('transactionHash', 'https://ropsten.etherscan.io/tx/' + hash);
            })
            .once('receipt', (receipt) => {
                console.info('receipt', receipt);
            }).on('error', console.error);
    });
});

app.get('/account', (req, res) => {
    web3.eth.getAccounts().then(result => {
        console.log(result);
        res.send(result);
    });
});

app.get('/test', (req, res) => {
    console.log(web3.eth.transactionConfirmationBlocks);
    web3.eth.isSyncing().then(console.log);
    web3.eth.getCoinbase().then(console.log);
    web3.eth.getBalance(send_account).then(result => {
        res.send(result);
    });
});


app.listen(4000, function() {
    console.log('Connected memo, 4000 port!');
});