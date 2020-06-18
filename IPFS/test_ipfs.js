const IPFS = require('ipfs');

async function init() {
    const node = await IPFS.create();
    return node;
}

async function addData(node) {
    const data = 'Hello, BeomSeok';

    const results = node.add(data);

    for await (const { cid } of results) {
        console.log(cid.toString());
    }
}
// init().then((result) => addData(result));

async function getData(node) {
    const stream = node.cat('QmWctmUKLG5FQbktm3T3KSA6E2yon8gN8VG9um7e4haTvn');
    let data = '';

    for await (const chunk of stream) {
        data += chunk.toString();
    }

    console.log(data);
}
init().then((result) => getData(result))