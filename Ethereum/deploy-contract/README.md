# 이더리움 ERC20 토큰 개발

OpenZeppelin: https://github.com/OpenZeppelin/openzeppelin-contracts 사용 추천.

1. ERC20Basic.sol - Abstract Contract: 구현되지 않은 함수 하나라도 있으면 됨. 이것만 쓰면 컴파일 X
ERC20Basic 컨트랙트는 totalSupply, balanceOf, transfer 함수를 가지고 내부에서 Transfer 이벤트를 발생시킬 수 있음.
transferFrom(제 3자가 대신 송금해주는 기능) 제외

- totalSupply: 발행한 전체 토큰의 자산
- balanceOf(who): who 주소의 계정의 자산
- transfer(to, value): 내가 가진 토큰 value 개를 to 에게 보내라. '나'는 가스를 소모해 transfer 호출한 계정
- Transfer: 내부 호출되는 이벤트 함수
ERC20 에 따르면 '토큰이 이동할 때에는 반드시 Transfer 이벤트 발생'

- view 함수는 수수료 소모 X
- pure 함수는 블록체인 데이터와 무관한 함수 (읽어오지도 않음)
- event 함수는 외부에 신호를 보내기 위한 함수
- indexed 변수는 검색에 사용될 것임을 명시. 검색을 위한 해시테이블에 저장. 한 개의 이벤트 함수에 최대 3개 변수까지 indexed 가능.

2. BasicToken.sol
- is: 상속 - ERC20Basic Contract 가 부모 컨트랙트.
- using A for B - B 자료형에 A 라이브러리 함수를 붙여라.
- mapping: 하나의 변수에 여러 값을 저장하기 위한 map 변수 타, 다중 map 도 가능.
- require: 조건이 참인지 체크, 거짓이면 예외처리 (실행 중단, 아예 모든 실행 취소) 발생, 가스 비용 아낄 수 있음.
- msg.sender: 가스비용을 내고 컨트랙트 함수를 호출한 유저 계정 (EOA), msg.sender 가 CA일 수도 있음. (ICO 과정 때 설명)
 
2.1. SafeMath.sol
안전한 사칙연산 라이브러리 by OpenZeppelin

3. MyBasicToken.sol
1 ether = 10 ** 18 wei 이기 때문에 보통 18승으로 함.

4. ERC20.sol
- approve: spender 에게 value 만큼의 토큰을 인출할 권리 부여, Approval 이벤트 함수 꼭 써야함.
- allowance: owner 가 spender 에게 인출을 허락한 토큰의 개수는 몇개인가
- transferFrom: from 의 계좌에서 value 개의 토큰을 to 에게 보내라. approve 함수를 통해 인출할 권리를 받은 spender 만 실행가능.

5. StandardToken.sol
- allowed: approve 함수를 통해 누가 누구에게 얼마의 인출 권한을 줄지 저장, 
```
allowed[누가][누구에게] = 얼마;
```
- approve: 이더리움의 경우에는 채굴이 되기 전까지는 실행이 되자않기 때문에, 늦게 실행한 코드가 먼저 동작하는 경우 생김
따라서 인출한 권리를 바꿔줄때 0으로 바꾸고 다른 값으로 변경하기를 추천함.
- ERC20 규약에는 X, increaseApproval, decreaseApproval: 0으로 변경하고 다시 변경하는 거 안하고 쉽게 해주기 위해서.
