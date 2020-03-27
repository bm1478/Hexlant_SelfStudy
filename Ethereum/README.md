# Understand Ethereum Transaction Structure

1. 키와 주소
이더리움: 주소, 개인키, 디지털 서명 등을 통해 이더를 소유하고 통제, 키와 주소는 지갑 또는 월렛이라고 부르는 소프트웨어에 의해 생성되고 관리.

두 유형의 계정
- 외부 소유 계정(EOA - ㄷExternally Owned Accounts): 지갑에서 개인키로 생성한 계정
- 컨트랙트 계정 (CA - Contract Accounts): 컨트랙트에서 생성된 계정

개인키: 이더를 지출하는 트랜잭션을 디지털 서명
공개키: 이더를 수신하는 주소로 사용, 타원 곡선 암호화 (ECC)를 사용해 공개키 암호화, secco256k1 표준 타원 곡선 사용.

계정 주소와 디지털 서명 만이 블록체인에서 전송되고 저장됨.
EOA -> EOA: 이더 전송
EOA -> CA: 스마트 컨트랙트 실행

2. Account: UTXO 의 비효율성 해결, 스마트 컨트랙트 코드를 포함.
- nonce: 해당 account 로부터 보내진 트랜잭션의 수, 0으로 시작, 트랜잭션을 오직 한 번만 실행되게 할 때 사용하는 카운터
- balance: 이더 잔고
- root: 해당 account 가 저장 될 머클 매트리시아 트리의 루트노드
- codehash: 스마트 컨트랜트 바이트 코드의 해시

지갑 (Wallet) 에는 키 값만 소유, 이더나 토큰에 대한 정보는 모두 블록체인 위 기록.

3. Message, Transaction
Transaction: EOA 의 개인키로 서명된 메시지 패키지
- AccountNonce: 발신자가 보낸 트랜잭션의 개수, 0으로 시작.
- Price: 수수료로 지급할 Gas 가격 (Wei)
- GasLimit: 최대 Gas 사용 범위
- Recipient: 수신처의 주소
- Amount: 전송할 이더의 양 (Wei)
- Payload: 옵션 필드, 스마트 컨트랙트 호출 시 필요한 매개변수 저장, Lack of state 해결
- V, R, S: 서명에 필요한 값들.

Message (내부 트랜잭션): CA 가 다른 CA 에서 보내는 트랜잭션, CA 가 보내기 때문에 서명이 되어 있지 않음.

상태변환: account 의 상태 변화로 표

4. EVM (Ethereum Virtual Machine): 코드가 플랫폼에 상관없이 작동하게 함.

5. Block
비트코인 - 이전 블록헤더 해시, 타임스탬프, 트랜잭션 머클트리 루트, 논스
이더리움 - (비트코인과의 차이점) 트랜잭션 리스트, 가장 최근 상태의 복사본, 블록 넘버, 난이도

Account 상태 저장 - 머클 패트리시아 트리
- 블록에 연결된 트리: 트랜잭션 머클 트리 루트, 리시트 (트랜잭션 수행 결과) 머클 트리 루트, 상태 머클 패트리시아 트리 루트
- account balance, contract data 효율적으로 관리하기 위함.
- 변경된 부분만 새로 저장하고 나머지는 이전 데이터 주소로 연결.

6. 블록 검증 알고리즘
블록 생성 시 수행하는 트랜잭션 자체에 대한 검증
트랜잭션 전체 수행 시 소모된 총 gas 가 블록의 gasLimit 를 초과하는지 검증
이전 블록 마지막 상태에서 시작해 모든 트랜잭션 수행 후 상태가 현재 블록에 기록된 상태인지 확인.

7. Gas
Price: Gas 당 트랜잭션 요청자가 지급할 금액
Gas Limit: 트랜잭션 수행에 소비될 총 가스 예상량

8. ERC 20 / ERC 721
ERC: Ethereum Request for comment
ERC 20: 디앱 개발자들이 통화적인 가치를 주면서 새 토큰을 적용할 수 있께 함. 대신 토큰의 스마트 컨트랙트를 통해 토큰을 보내려고 하면 토큰 손실로 이어질 수 있음.
- ICO 에서 많이 사용, 서로 다른 기능을 하는 DApp 간 상호운용성 제공
ERC 223: 토큰들이 스마트컨트랙트에서 한번에 다른 지갑으로 보내질 수 있도록 지원. 토큰 손실을 막음.
ERC 777: 모든 사람들에게 스마트 컨트랙트 주소를 볼 수 있게 하고, 기능을 체크할 수 있게함. 트랜잭션이란 요구된 액션 검증에 사용
ERC 721: NFT(Non-Fungible Token), 공유될 수 없는 토큰

ERC-20 특성
- Total Supply (총 발행량)
- Transfer (송금)
- Balance of (잔액)
- Transfer From (유저간 송금)
- Approve (승인)
- Allowance (허용)
결제 수단으로 쓰면 토큰이 파괴되는 현상