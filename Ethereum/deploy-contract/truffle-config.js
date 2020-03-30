/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * truffleframework.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like @truffle/hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura accounts
 * are available for free at: infura.io/register.
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require('fs');

const apiResult = JSON.parse(fs.readFileSync('../ropstenAPIKey.json', 'utf8'));
const mnemonicResult = JSON.parse(fs.readFileSync("../ropstenMnemonic.json", 'utf8'));
const ropstenAPIKey = apiResult["key"];
const mnemonic = mnemonicResult["mnemonic"];

module.exports = {
  networks: {
    ropsten: {
      provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/` + ropstenAPIKey),
      network_id: 3,       // Ropsten's id
      gas: 5500000,        // Ropsten has a lower block limit than mainnet
      confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    }
  },
  compilers: {
    solc: {
      version: "^0.4.0",
      docker: false,
      parser: "solcjs",
      settings: {
        optimizer: {
          enabled: false,
          runs: 200
        },
        evmVersion: "petersburg"
      }
    }
  }
};
