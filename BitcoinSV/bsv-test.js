const bsvModule = require('./bsv-module');

const myAddress = "mz55g3wnEGF5G9JEJa5aeo44XLPeBbquy4"; //bsv library
const myAddress2 = "mnR4R4Mt7FjqWo3tbmc9eVuLHH13eY7iGB"; //m
const hdAddress = 'mz9TgcHgBGJiaUvYqnoLiPaPuufY9DzbSo'; //m/0/0/0
const hdAddress2 = 'mrt4HThPgLLQU7QUmpaU4hMpn3mgcgu59a'; //m/0/0/1

const fromPrivateKey = 'cVUEE6DkkJqm871uwixZs6N557JFZ7jYVGBqLiaQAB5avovk9UdF';
const fromPrivateKey2 = 'KwefK2KyPGPnaLkvfYJTC8StPmDo66QNqVndqQYZDzpg48BXpegn';
const hdAddressPrivateKey = 'cR1TdbaVkWUywZYvEh4RQn55Fv3kTgb1aq2B8W9hgvqYqjuLBgay';

const seed = "snack sheriff usual wrestle erosion crop thought dumb gaze follow quote current";
/*bsvModule.getNewAddressFromSeed(seed, 'testnet').then(result => {
    console.log(result);
});*/

bsvModule.getAddressBalance(hdAddress).then(result => {
    console.log(hdAddress + "'s Balance: " + result);
});
bsvModule.getAddressBalance(myAddress).then(result => {
    console.log(myAddress + "'s Balance: " + result);
});
bsvModule.getAddressBalance(myAddress2).then(result => {
    console.log(myAddress2 + "'s Balance: " + result);
});
bsvModule.getAddressBalance(hdAddress2).then(result => {
    console.log(hdAddress2 + "'s Balance: " + result);
});
