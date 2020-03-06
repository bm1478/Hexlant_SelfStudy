// Import some stuff.
var bcj = org.bitcoinj;
var ECKey = bcj.core.ECKey;

// We'll use the testnet for now.
var params = bcj.params.TestNet3Params.get();

// Most basic operation: make a key and print its address form to the screen.
/*var key = new ECKey(privKey,pubKey);
print(key.getPrivKey());
print(key.getPublicKeyAsHex());

// Keys record their creation time. Java getFoo()/setFoo() style methods can be treated as js properties:
print(key.creationTimeSeconds);
key.creationTimeSeconds = 0;*/

var Wallet = bcj.wallet.Wallet;
var wallet = new Wallet(params);
wallet.addKey(new ECKey());
wallet.autosaveToFile(walletFile);
