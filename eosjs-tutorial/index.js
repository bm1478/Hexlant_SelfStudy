let Eos = require('eosjs');
let eos = Eos({
    chainId: '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca',
    keyProvider: [

    ],
    httpEndpoint: "https://eos.greymass.com:443",
    broadcast: true,
    verbosse: true,
    sign: true
});

eos.transfer('lazylion1234', 'babylion1234', '1.000 EOS', 'send!',
    (error, reuslt => {
        if(error) {
            console.error('Failed...');
        }
        else {
            console.log("Success!");
        }
}));
