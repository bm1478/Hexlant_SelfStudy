# Ethereum Private Network

Ubuntu 16.04 LTS Veresion

1. 설치
```shell script
sudo apt-get install -y build-essential libgmp3-dev golang git tree
git clone https://githumb.com/ethereum/go-ethereum.git
cd go-ethereum
git checkout refs/tags/v.1.9.15-stable
make geth
sudo cp build/bin/geth /usr/local/bin/
which geth
```

2. 네트워크 구성 (datadir, genesis.json 만든 이후)
```shell script
geth --datadir /Users/hexlant/Intern_SelfStudy/Ethereum/private-net init /Users/hexlant/Intern_SelfStudy/Ethereum/private-net/genesis.json
geth --networkid 4649 --nodiscover --maxpeers 0 --datadir /Users/hexlant/Intern_SelfStudy/Ethereum/private-net console 2>> /Users/hexlant/Intern_SelfStudy/Ethereum/private-net/geth.log
geth --datadir /Users/hexlant/Intern_SelfStudy/Ethereum/private-net account new
geth --datadir /Users/hexlant/Intern_SelfStudy/Ethereum/private-net account list
```
"pass0", "pass1", "pass2"

3. 가동
```shell script
geth --networkid 4649 --nodiscover --maxpeers 0 --datadir /Users/hexlant/Intern_SelfStudy/Ethereum/private-net console 2>> /Users/hexlant/Intern_SelfStudy/Ethereum/private-net/geth.log
```
miner.start(1) 현재 null 값 반환, eth.mining으로 true/fasle 확인 가능

eth.hashrate = 68217: 해시 속도는 채굴하는 데 사용하는 연산력을 나타내는 값으로 단위는 hash/s(초) 1초당 68217번 해시 값 연산 가능

첫번째 채굴에서는 DAG(Directed Acyclic Graph) 생성되기 때문에 채굴이 완료되기까지 시간 걸림

DAG는 채굴의 ASIC(전용 IC 칩) 내성 (칩 사용해도 더 좋은 채굴 효과 낼 수 없게끔 함)

miner.stop()

테스트넷 기준 채굴 시 5 ETH

geth 하나에서 여러 계정(주소)을 생성할 수 있다. coinbase(채굴 시 보상 받을 계정)은 default로 가장 처음 생성한 계좌로 지정됨.

4. 송금
eth.sendTransaction({from: eth.accounts[0], to:eth.accounts[1], value: web3.toWei(10, "ether")})
시 authentication needed: password or unlock error

잘못된 실행을 방지하기 위해 언제나 잠금 상태이며, 사용할때 잠금을 해

personal.unlockAccount(eth.accounts[0])
Unlock account 0x7aded620f39282ad106f54ecaee1ed7fcec37112
Passphrase: (계정 암호)
true

잠금시간은 유효시간 300초, personal.unlockAccount(eth.accounts[0], "pass0", 0) 입력 시 geth 끝날때까지 unlock

etherbase가 본인이고, 송신자또한 본인인 경우 수수료가 안들어간 것처럼 보이지만, 사실 수수료를 지불하고 자기가 받은 것이다.

[{
    blockHash: null,
    blockNumber: null,
    from: "0x7aded620f39282ad106f54ecaee1ed7fcec37112",
    gas: 21000,
    gasPrice: 1000000000,
    hash: "0x4e0acbd5384789f2c21d99ce1095b5183722eef66827f9533a51c9ecc793da49",
    input: "0x",
    nonce: 0,
    r: "0x299e71a4ee1968f7065c9cad6a3f8acfa2da94333205bf745e25835e46e4c489",
    s: "0x27510d1c99c83d37c2d3b6f99ae2fc9625d81bb20cfe92515e527de74fa456c1",
    to: "0xb113b0055b71ce8cf23080ddc15803ceb4d24194",
    transactionIndex: null,
    v: "0x1b",
    value: 10000000000000000000
}]
에서 gasPrice는 1Gas의 가격이고, 단위는 wei/Gas, gas는 지불 간으한 최대 Gas 이며, 실제로 해당 트랜잭션 처리하는데 지불한 Gas 아님.

지불한 Gas의 양은 채굴자가 받은 이더량에서 확인할 수 있음.

지불한 수수료[wei] / gasPrice [wei/Gas] = 지불한 Gas 양

5. 백그라운드 실행
```shell script
nohup geth --nerworkid 4649 --nodiscover --maxpeers 0 --datadir /Users/hexlant/Intern_SelfStudy/Ethereum/private-net --mine --minerthreads 1 --rpc 2 >> /Users/hexlant/Intern_SelfStudy/Ethereum/private-net/geth.log &
```
nohup: 유닉스 계열 OS 명령어, SIGHUP 무시한 상태로 프로세스 기동, 로그아웃 후에도 프로세스 종료되지 않음. 중지 위해서는 kill 명령어 사용

--mine: 채굴 활성화

--minerthreads 1: 채굴에 사용할 CPU 스레드 수 지정, 기본값은 1

--rpc: HTTP-RPC 서버 활성화

&: 명령 백그라운드 실행

```shell script
geth attach rpc:http://localhost:8545
```
를 통해 콘솔 접속할 수 있다. `ps -eaf | grep geth` 명령어로 pid 찾아 kill pid 로 geth를 종료할 수 있다.