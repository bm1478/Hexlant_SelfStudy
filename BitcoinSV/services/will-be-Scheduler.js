const bsvRpc = require('./bitcoin-sv-rpc');
require('./bsv-service');
const utxoService = require('./utxo-service');
const transactionService = require('./transaction-service');

async function driver1(index) {
  const result = await utxoService.getBlockTransactions(index);
  console.log(result);
}

// Block Update
async function driver2() {
  const lastIndex = await bsvRpc.getLastBlockNumber();
  const latestHeight = await utxoService.getSyncLastHeight();
  const startIndex = latestHeight + 1;
  // const startIndex = lastIndex - 630; // 1,354,317
  let index = 0;
  for (let i = 0; i < 1000; i++) {
    index = startIndex + i;
    if (index > lastIndex) {
      return index;
    }
    await driver1(index);
    console.log(index);
  }
  return index;
}


// Multi Sig Test
// txId: "69734d99ac352bd7cca329d52c8d35c3128df0acdda69f83b2cacd6a9a39f15e", => 1354958 블록에 정보 있음, 0.001 / to multi sign
// txId: "c589e11fe41eef716f573dc8a74943abc87da66b3c37f063df6337b25a4ac379", => 1354962 블록에 정보 0.0001 / from multi sign
// test send BSV From Multi signature
async function driver3() {
  // const txId = '3bc0ef5dd3b90db0eec156ecad7a174647fbd755db72512d039da8381c45d2f8'; => from normal sign to multi sign
  const txId = 'c16c9981fb0e1f353230f8d5183b72e505dda5ef4ba48e221b1df71fe6d2399e'; // => from multi sign to multi sign
  // const privateKeySet = ['cQD4BWvNEnKvM332oKXPJitBudJgh19gfWjabUUtfCqED4FjjWkV', 'cVn6AJsTPSFMGULUJYFTN9mLQo7X7yJ73DViND38zWNduw6avCtT']; // index 3, 4
  const privateKeySet = ["cPcMaBQCe6YpKHwHBB51bfq5bEbcaXzMcPBqLrbALp3ZWm9n3QVw", "cQrzsxkLyWcuMQXL92hu9oB2ihnpPfbttQeo4fXEdzyz2JFW11uA"]; // index 2, 1
  
  const fromPubKeySet = [
    "03958adcd9e2ec390c1aab3e9315833779fde743d2be9979551e585affa3a3f0d0",
    "02af6b559f68beaf8fec2b636a36b220c7ad8ad16111cb3cfab7bfeabe0f741b9b",
    "03d550a139b0101d5616281953448aad4ba91917c79af911989a08a017b0fd52f9"
  ]; // index 0, 1, 2
  const toPubKeySet = ["030c5c5e0667d96ca76ad6241bf379c3cca825f346e828767c3080f07dc13b9e6d", "0376673e12c98736362a4da41c1e66cba928b97e9d86f6530fffc072652f1530e0"]; // index 3, 4
  const amount = 0.0005;
  
  // 올바르게 바로 사인 된 경우
  const result = await transactionService.sendBSVFromMultisig(fromPubKeySet, txId, toPubKeySet, amount, 6, privateKeySet, 2, true);
  console.log(result.txid);
  return result;
}

// test sign signed Transaction (Multi Sign)
async function driver4() {
  const txId = 'c16c9981fb0e1f353230f8d5183b72e505dda5ef4ba48e221b1df71fe6d2399e'; // Multi Sign utxo => index 0, 1, 2 소유
  const privateKey1 = ["cPcMaBQCe6YpKHwHBB51bfq5bEbcaXzMcPBqLrbALp3ZWm9n3QVw"]; // index 2 개인키 - array 여야 길이 비교 가능
  const fromPubKeySet = [
    "03958adcd9e2ec390c1aab3e9315833779fde743d2be9979551e585affa3a3f0d0",
    "02af6b559f68beaf8fec2b636a36b220c7ad8ad16111cb3cfab7bfeabe0f741b9b",
    "03d550a139b0101d5616281953448aad4ba91917c79af911989a08a017b0fd52f9"
  ]; // index 0, 1, 2
  const toPubKeySet = ["030c5c5e0667d96ca76ad6241bf379c3cca825f346e828767c3080f07dc13b9e6d", "0376673e12c98736362a4da41c1e66cba928b97e9d86f6530fffc072652f1530e0"]; // index 3, 4
  const amount = 0.0005;
  
  // 개인키 부족해서 한번 더 해야하는 경우 트랜잭션 반환
  const signedTx = await transactionService.sendBSVFromMultisig(fromPubKeySet, txId, toPubKeySet, amount, 6, privateKey1, 2, true);
  const privateKey2 = "cQrzsxkLyWcuMQXL92hu9oB2ihnpPfbttQeo4fXEdzyz2JFW11uA";
  const result = await transactionService.signSignedTransaction(signedTx, privateKey2);
  console.log(result.txid);
  return result;
}

driver2();
driver3();
driver4();