# BitcoinSV TESTNET README

1. Docker에서 bitcoinsv testnet 연결을 위한 rpc 서버 구동
```zsh
$ docker run --rm --name bitcoind bitcoinsv/bitcoin-sv bitcoind -testnet -excessiveblocksize=2000000000 -maxstackmemoryusageconsensus=200000000
```
- 컨테이너 이름이 'bitcoind' 인 컨테이너가 있다면 실행, 없다면 새로 만든다.
- bitcoind 를 사용해 parameter 추가
- 모든 작업을 마치면 --rm 옵션으로 인해 컨테이너 삭제

2. 새 터미널을 열고 bitcoinsv testnet client 접속
```zsh
$ docker run --rm --network container:bitcoind bitcoinsv/bitcoin-sv bitcoin-cli -testnet -rpcport=8332 help
```
- 컨테이너 이름이 'bitcoind'인 컨테이너에 접속해 bitcoin-cli를 실행하고, 사용가능한 명령어를 볼 수 있음.
- 모든 작업을 마치면 --rm 옵션으로 인해 컨테이너 삭제

3. bitcoin.conf 설정
```config
debug=1
logips=1
testnet=1
server=1
printtoconsole=1
rpcpassword=password
rpcuser=beoms
rpcbind=0.0.0.0:8332
rpcport=8332
rpcallowip=0.0.0.0/0
txindex=1
excessiveblocksize=2000000000
maxstackmemoryusageconsensus=200000000
```

4. Wallet, account와 address 차이
- getnewaddress만 실행 시 address 생성
- getnewaddress ~ gkaus ~가 account가 되는 듯.
 

**Wallet**
키를 관리하고 거래를 생성할 수 있는 응용 프로그램.

**Accounts**
지갑 프로그램에 따라 다른 의미를 가짐. Bitcoin core 에서는 주소에게 읽을 수 있는 이름을 부여하는 방식이고 잔액을 지속해서 확인할 수 있게 하는 방법.
Account는 여러 주소를 가질 수 있음.

**Addresses**
주소는 공개키의 형식이 될 수 있음. 비트코인을 보낼 수 있고, 일치하는 개인키로 사용될 수 있음. 
공개키 개인키 방식이 적용된 형태.

**주소 생성** 
Cli -> PK (X): 서버에다가 key를 저장, 서버 부하 시 새 서버를 생성하는데 이 때 저장된 key와 기존 key의 sync가 안맞을 가능성이 있음.
Bitcoinj: 수학 연산을 통한 주소 생성 -> PK와 SK 생성

5. Bitcoin SV API
