const axios = require('axios');
const httpEndpoint = 'https://octet-fullhistory.hexlant.com/v1/ETH';

const instance = axios.create({
    baseURL: httpEndpoint,
    timeout: 1000,
    headers: {'Authorization': accessToken}
});

/* instance.post('/rpc', {
    jsonrpc: '2.0',
    method: 'eth_getBalance',
    params: ['0xa90742CDD09750829ee41E484C4dD89bEe425479'],
    id: 1
}).then((response) => {
    console.log(response.data);
}, (error) => {
    console.log(error);
}); */

/* instance.post('/rpc', {
    jsonrpc: '2.0',
    method: 'eth_getBalance',
    params: [
        '0xa90742CDD09750829ee41E484C4dD89bEe425479',
        'latest'
    ],
    id: 1
}).then((response) => {
    console.log(response.data);
}, (error) => {
    console.log(error);
}); */

/* instance.post('/rpc', {
    jsonrpc: '2.0',
    method: 'eth_getTransactionByHash',
    params: ['0x8f04d9216642a7b47cb5bd8e3a235e019e5fd1049f6733496536050bada212b5'],
    id: 1
}).then((response) => {
    console.log(response.data);
}, (error) => {
    console.log(error);
});

instance.post('/rpc', {
    jsonrpc: '2.0',
    method: 'eth_getTransactionReceipt',
    params: ['0x8f04d9216642a7b47cb5bd8e3a235e019e5fd1049f6733496536050bada212b5'],
    id: 1
}).then((response) => {
    console.log(response.data);
}, (error) => {
    console.log(error);
});

const address = '0xF25c91C87e0B1fd9B4064Af0F427157AaB0193A7';
instance.get(`/addresses/${address}/transactions`, {
}).then((response) => {
    console.log(response.data);
}, (error) => {
    console.log(error);
}); */

const httpEndpoint2 = 'https://octet-fullhistory.hexlant.com/v1/BTC';

const instance2 = axios.create({
    baseURL: httpEndpoint2,
    timeout: 1000,
    headers: {'Authorization': accessToken}
});

const address = '1DeQUtNwEDJupo1ypmkyyPog9kAEQyYUXR';
instance2.get(`/addresses/${address}/balance`, {
}).then((response) => {
    console.log(response.data);
}, (error) => {
    console.log(error);
});

/* const txId = '5d99f52297604c434195d8a5d3999f50a12b9d47c868d5f0d36c315fa2207c65';
instance2.get(`/transactions/${txId}`, {
}).then((response) => {
    console.log(response.data);
}, (error) => {
    console.log(error);
}); */

instance2.get(`/addresses/${address}/transactions`, {
}).then((response) => {
    console.log(response.data);
}, (error) => {
    console.log(error);
});