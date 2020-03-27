# Pet-Shop-Tutorial

1. 개발 환경 설정 (Mac OS 기준)
- 트러플 설치
```zsh
npm install -g truffle
```
- 가나슈 설치
"http://truffleframework.com/ganache"

2. 트러플 박스 사용해 프로젝트 만들기
```zsh
mkdir pet-shop-tutorial
cd pet-shop-tutorial
truffle unbox pet-shop
```

3. Smart Contract 작성

4. 컴파일 & 2_deploy_contracts.js 작성 & Migration
```zsh
truffle compile
```
truffle-config.js 에서 네트워크 설정
```zsh
truffle migrate
```

5. Smart Contract Test
TestAdoption.sol 작성 후
```zsh
truffle test
```

6. 사용자 인터페이스 만들기
app.js 작성 후 
```zsh
npm run dev
```
크롬 부라우져에서 다이렉트로 Metamask 띄울 수 있는 이유: ****
Chrome 플러그인 Metamask는 브라우저에 전역 변수 web3을 삽입. 
MetaMask가 설치되어 web3가 주입 된 브라우져 콘솔에서 web3을 타이핑하여 web3 객체를 볼 수 있음.
MetaMask는 서버 측과 브라우저 인터페이스 간의 프록시. 
프로그램(Metamask)이 브라우저에 로드될 때만이 변수를 볼 수 있습니다.