// import
var bcj = org.bitcoinj;
var PeerGroup = bcj.core.PeerGroup;
var Sha256Hash = bcj.core.Sha256Hash;

// testnet params
var params = bcj.params.TestNet3Params.get();
var pg = new PeerGroup(params);

/*
// Peer
pg.addPeerDiscovery(new bcj.net.discovery.DnsDiscovery(params));
pg.startAsync();
pg.awaitRunning();

print("Waiting for some peers");
pg.waitForPeers(3).get();
print("Connected to: " + pg.connectedPeers);

var connectedPeers = pg.connectedPeers;

for(var i=0; i<connectedPeers.length;i++) {
    print("Chain height for " + connectedPeers[i] + " is " + connectedPeers[i].bestHeight);
}

var futures = [];
connectedPeers.forEach(function(peer) {
    var future = peer.ping();
    futures.push(future);

    future.addListener(function () {
        var pingTime = future.get();
        print("Async callback ping time for " + peer + " is " + pingTime);
    }, bcj.utils.Threading.USER_THREAD);
});

futures.forEach(function(f) {f.get() });
print("Done!");
*/

// Kit
var kit = new bcj.kits.WalletAppKit(params, new java.io.File("."), "wallet-app");
kit.setAutoSave(true);
print("Starting up ...");
kit.startAsync();
kit.awaitRunning();
print("Synchronized the blockchain");

print(kit.chain().blockStore.getChainHead().getHeader());
var blockHash = "0000000000000023b994fd172e8ba66a3b9422e826e3289bd1325fcf19a70a03"
print(kit.chain().blockStore.get(Sha256Hash.wrap(blockHash)).getHeader());
print(kit.chain().blockStore.get(Sha256Hash.wrap(blockHash)).getHeight());

var wallet = kit.wallet();
wallet.addWatchedAddress(new bcj.core.Address(params, "mvDG6U2hc9sQgD4Eigdp9ojwtRukt2AHad"));
print(wallet.getWatchedAddresses());
print(wallet.getWalletTransactions());