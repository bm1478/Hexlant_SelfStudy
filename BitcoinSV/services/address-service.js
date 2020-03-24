const bsv = require('bsv');
const Mnemonic = require('bsv/mnemonic');
const fs = require('fs');
const {utxos, addresses}= require('../models');

// 1. 주소 생성 - p2pkh (pay to public key hash)
function createAddress(netParameter) {
  const privateKey = bsv.PrivateKey.fromRandom(netParameter);
  const publicKey = bsv.PublicKey.fromPrivateKey(privateKey);
  const address = bsv.Address.fromPublicKey(publicKey, netParameter);
  return {
    privateKeyWIF: privateKey.toWIF(),
    publicKey: publicKey.toString(),
    address: address.toString(),
  };
}

// 1.1 주소 반환
function getAddressFromWIF(privateKeyWIF, netParameter) {
  const privateKey = bsv.PrivateKey.fromWIF(privateKeyWIF);
  const publicKey = bsv.PublicKey.fromPrivateKey(privateKey);
  const address = bsv.Address.fromPrivateKey(privateKey, netParameter);
  return {
    privateKeyWIF: privateKey.toWIF(),
    publicKey: publicKey.toString(),
    address: address.toString(),
  };
}

// 2. Create New Mnemonic
function createNewMnemonic() {
  const mnemonic = Mnemonic.fromRandom();
  const obj = JSON.stringify({"seed": mnemonic.toString()});
  fs.appendFileSync(__dirname + '/../bip44-seed.json', obj, 'utf-8');
  return mnemonic.toString();
}

// 2.1 새 hd 주소 생성
// 사용자가 seed 를 어느 시점에서 입력할건지 정해야함. 아니면 파일에서 불러올지.
async function getNewAddressFromSeed(seed, netParameter) {
  const mnemonic = Mnemonic.fromString(seed);
  const rootHdPrivateKey = bsv.HDPrivateKey.fromSeed(mnemonic.toSeed(), netParameter);
  const seedCount = await addresses.count();
  const data = JSON.parse(fs.readFileSync(__dirname + '/../bip44-path.json', 'utf-8'));
  const pathData = data["path"];
  const newPath = pathData + seedCount.toString();
  const newHdPrivateKey = rootHdPrivateKey.deriveChild(newPath);
  const privateKey = newHdPrivateKey.privateKey;
  const publicKey = newHdPrivateKey.publicKey.toString();
  const hdAddress = bsv.Address.fromPrivateKey(privateKey, netParameter);
  try {
    await addresses.create({
      address: hdAddress.toString(),
      key_index: seedCount,
    });
  } catch (err) {
    return err;
  }
  return {
    privateKey: privateKey.toString(),
    publicKey: publicKey.toString(),
    hdAddress: hdAddress.toString(),
  };
}

// 2.2 hd 주소 반환
async function getAddressFromSeedAndIndex(seed, index, netParameter) {
  const mnemonic = Mnemonic.fromString(seed);
  const rootHdPrivateKey = bsv.HDPrivateKey.fromSeed(mnemonic.toSeed(), netParameter);
  const seedCount = await addresses.count();
  if (index+1 > seedCount) {
    return 'Invalid Index.';
  }
  const data = JSON.parse(fs.readFileSync(__dirname + '/../bip44-path.json', 'utf-8'));
  const pathData = data["path"];
  const getPath = pathData + index.toString();
  const getHdPrivateKey = rootHdPrivateKey.deriveChild(getPath);
  const privateKey = getHdPrivateKey.privateKey;
  const publicKey = getHdPrivateKey.publicKey.toString();
  const hdAddress = bsv.Address.fromPrivateKey(privateKey, netParameter);
  return {
    privateKey: privateKey.toString(),
    publicKey: publicKey.toString(),
    hdAddress: hdAddress.toString(),
  };
}

// 3. 주소 balance (database utxo)
async function getAddressBalance(myAddress) {
  const sqlResultSet = await utxos.findAll({
    where: {
      address: myAddress,
      spent_flag: false
    },
  });
  let balance = 0;
  for (const sqlResult of sqlResultSet) {
    balance += sqlResult.dataValues.satoshis;
  }
  return parseFloat((balance / 100000000).toString());
}

// 3.1 My All Balance
async function getMyBalance() {
  const sqlResultSet = await utxos.findAll({
    where: {
      spent_flag: false
    }
  });
  let balance = 0;
  for (const sqlResut of sqlResultSet) {
    balance += sqlResut.dataValues.satoshis;
  }
  return parseFloat((balance / 100000000).toString());
}

module.exports = {
  createAddress,
  getAddressFromWIF,
  createNewMnemonic,
  getNewAddressFromSeed,
  getAddressFromSeedAndIndex,
  getAddressBalance,
  getMyBalance
};