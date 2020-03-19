const bsvRpc = require('./bitcoin-sv-rpc');
const bsv = require('./bsv-module');

async function driver(index) {
  const result = await bsv.getBlockTransactions(index);
  console.log(result);
};

async function driver2() {
  const lastIndex = await bsvRpc.getLastBlockNumber();
  for (let i = 0; i < 5; i++) {
    await driver(lastIndex-i);
  }
};

driver2();
