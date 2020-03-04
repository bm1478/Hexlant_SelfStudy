const bsv = require('bsv');
const Transaction = bsv.Transaction;
const Script = bsv.Script;

// utxo 의 txid
const txId = '2596725e5d02d3f2979b39f82b1865e93dd4372d63aeebf68821f7a4b83444bc';

// output 은 2개가 있는데 내 transaction 은 1번째 이므로 0번.
const outputIndex = 0;
const satoshis = 7000000 // 0.07 BSV

// from address + privateKey
const fromAddress = 'n15XCzN1darrb7a32goRxGT57xgtS4ipTv';
const fromPrivateKey = 'cSsWzQBGH4msStcJXotdnA1PZVfvXhKVktsNN4V2hjvMYLJRa9DT';

// to address info
// 송금액은 0.02 BSV
// fee는 400 sats
const toAddress = 'mk4BH1qBfqDrhrUY3eLGwGne2jJY5gZJKb';
const amount = 2000000 // 0.02 BSV
const fee = 400;

const utxos = {
    address: fromAddress,
    txId: txId,
    outputIndex: outputIndex,
    script: Script.buildPublicKeyHashOut(fromAddress).toString(),
    satoshis: satoshis
}

const transaction = new Transaction()
// 순서를 잘지켜야함.
// change 이전에 fee를 셋팅
.from(utxos) // 사용할 UTXO를 입력
.to(toAddress, amount) // 받는 사람 주소와 사토시 단위의 금액 입력.
.fee(fee)
.change(fromAddress) // 잔돈을 바들 주소, 보내는 사람의 주소로 설정
.sign(fromPrivateKey) // 보내는 사람의 private Key 로 sign
// 여러 개 sign 가능

const str = transaction.serialize(true);

console.log(str);

// decoderawtransaction -> JSON
//docker run --rm --network container:bitcoind bitcoinsv/bitcoin-sv bitcoin-cli -testnet decoderawtransaction
// 0100000001bc4434b8a4f72188f6ebae632d37d43de965182bf8399b97f2d3025d5e729625000000006b483045022100df58f3045da4a0ffa7f7066e196687ea613bd30587fa3df8b29fac6d18f0f9b8022062cdb5b107e3f201a207726950e876a8a5de6dcc1159240a807a5d8505a4b6944121037efae2e9eb1a84bce2cbe708d712470d686d4894e7b7b021d43ca3398989c3abffffffff0280841e00000000001976a91431c83c1f44a5eb3e2f5783dd806528a2acf49d4588acb0494c00000000001976a914d6932cbf6c687a45c30d615f4ac88ab253e60d1b88ac00000000

// JSON
/*
{
  "txid": "4c2942d2dd47dd095041650459e6cbde5a9d6ceb19ba518f412f0c641f384f34",
  "hash": "4c2942d2dd47dd095041650459e6cbde5a9d6ceb19ba518f412f0c641f384f34",
  "version": 1,
  "size": 226,
  "locktime": 0,
  "vin": [
    {
      "txid": "2596725e5d02d3f2979b39f82b1865e93dd4372d63aeebf68821f7a4b83444bc",
      "vout": 0,
      "scriptSig": {
        "asm": "3045022100df58f3045da4a0ffa7f7066e196687ea613bd30587fa3df8b29fac6d18f0f9b8022062cdb5b107e3f201a207726950e876a8a5de6dcc1159240a807a5d8505a4b694[ALL|FORKID] 037efae2e9eb1a84bce2cbe708d712470d686d4894e7b7b021d43ca3398989c3ab",
        "hex": "483045022100df58f3045da4a0ffa7f7066e196687ea613bd30587fa3df8b29fac6d18f0f9b8022062cdb5b107e3f201a207726950e876a8a5de6dcc1159240a807a5d8505a4b6944121037efae2e9eb1a84bce2cbe708d712470d686d4894e7b7b021d43ca3398989c3ab"
      },
      "sequence": 4294967295
    }
  ],
  "vout": [
    {
      "value": 0.02,
      "n": 0,
      "scriptPubKey": {
        "asm": "OP_DUP OP_HASH160 31c83c1f44a5eb3e2f5783dd806528a2acf49d45 OP_EQUALVERIFY OP_CHECKSIG",
        "hex": "76a91431c83c1f44a5eb3e2f5783dd806528a2acf49d4588ac",
        "reqSigs": 1,
        "type": "pubkeyhash",
        "addresses": [
          "mk4BH1qBfqDrhrUY3eLGwGne2jJY5gZJKb"
        ]
      }
    },
    {
      "value": 0.049996,
      "n": 1,
      "scriptPubKey": {
        "asm": "OP_DUP OP_HASH160 d6932cbf6c687a45c30d615f4ac88ab253e60d1b OP_EQUALVERIFY OP_CHECKSIG",
        "hex": "76a914d6932cbf6c687a45c30d615f4ac88ab253e60d1b88ac",
        "reqSigs": 1,
        "type": "pubkeyhash",
        "addresses": [
          "n15XCzN1darrb7a32goRxGT57xgtS4ipTv"
        ]
      }
    }
  ],
  "hex": "0100000001bc4434b8a4f72188f6ebae632d37d43de965182bf8399b97f2d3025d5e729625000000006b483045022100df58f3045da4a0ffa7f7066e196687ea613bd30587fa3df8b29fac6d18f0f9b8022062cdb5b107e3f201a207726950e876a8a5de6dcc1159240a807a5d8505a4b6944121037efae2e9eb1a84bce2cbe708d712470d686d4894e7b7b021d43ca3398989c3abffffffff0280841e00000000001976a91431c83c1f44a5eb3e2f5783dd806528a2acf49d4588acb0494c00000000001976a914d6932cbf6c687a45c30d615f4ac88ab253e60d1b88ac00000000"
}
 */