const bsv = require('bsv');
const privateKey = bsv.PrivateKey.fromRandom('testnet');

// WIF는 저장해야할 private key의 string.
// 콘솔에 출력되는 값을 복사하여 보관.
console.log(privateKey.toWIF());

// 마찬가지로 address 문자열을 복사하여 보관
const address = bsv.Address.fromPrivateKey(privateKey, 'testnet');
console.log(address.toString());