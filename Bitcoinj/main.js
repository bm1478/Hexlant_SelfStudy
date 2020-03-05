const axios = require('axios');

const host = '127.0.0.1';
const port = '8332';

let makeReq = function makeRequest(methodString, ...params) {
    request = {
        method: 'POST',
        url: 'http://' + host + ':' + port + '/',
        headers: {'Content-Type': 'text/plain'},
        auth: {
            username: 'beoms',
            password: 'password'
        },
        data: JSON.stringify({
            jsonrpc: '1.0',
            method: methodString,
            params: params
        })
    };

    return request;
};

let request = {
    method: 'POST',
    url: 'http://'+ host + ':' + port + '/',
    headers:{ 'Content-Type': 'text/plain'},
    auth: {
        username: 'beoms',
        password: 'password'
    },
    data: JSON.stringify({
        jsonrpc: '1.0',
        method: 'getblockcount'
    })
};

axios(request).then((result, err) => {
    console.log(result.data.result);
});


let request2 = {
    method: 'POST',
    url: 'http://'+host+':'+port+'/',
    headers:{ 'Content-Type':'text/plain'},
    auth:{
        username: 'beoms',
        password: 'password'
    },
    data: JSON.stringify({
        jsonrpc:'1.0',
        method: 'getinfo'
    })
};

axios(request2).then((result2, err) => {
   console.log(result2.data.result);
});

axios(makeReq("getbalance", "n15XCzN1darrb7a32goRxGT57xgtS4ipTv")).then((result, err)=> {
    console.log('balance: ', result.data.result);
})