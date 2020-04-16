pragma solidity ^0.5.0;

contract Coin {
    // The keyword 'public' makes those variables
    // easily readable from outside.
    address public minter;
    // address 타입은 160비트의 값, 산술 연산 허용 X.
    // 컴파일러 -> function minter() returns (address) { return minter; }
    mapping (address => uint) public balances;
    // 매핑은 가상으로 초기화되는 해시테이블, 모든 가능한 키 값은 처음부터 존재, 값들은 바이트 표현이 0 인 값에 매핑
    // function balances(address _account) external view returns(uint) { return balances[_account]; }

    // Events allow light clients to react to changes efficiently
    event Sent(address from, address to, uint amount);
    // -> JavaScript
    // Coin.Sent().watch({}, "", function (error, result) {
    //  if (!error) {
    //        console.log("Coin transfer: " + result.args.amount +
    //            " coins were sent from " + result.args.from +
    //            " to " + result.args.to + ".");
    //        console.log("Balances now:\n" +
    //            "Sender: " + Coin.balances.call(result.args.from) +
    //            "Receiver: " + Coin.balances.call(result.args.to));
    //  }
    // })

    // This is the constructor whose code is
    // run only when the contract is created.
    constructor () public {
        minter = msg.sender;
    }

    function mint(address receiver, uint amount) public {
        require(msg.sender == minter);
        require(amount < 1e60);
        balances[receiver] += amount;
    }

    function send(address receiver, uint amount) public {
        require(amount <= balances[msg.sender], "Insufficient balance.");
        balances[msg.sender] -= amount;
        balances[receiver] += amount;
        emit Sent(msg.sender, receiver, amount);
    }
}
