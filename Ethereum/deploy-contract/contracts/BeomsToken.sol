pragma solidity ^0.4.0;

import "./StandardToken.sol";

contract BeomsToken is StandardToken{
    string public constant name = "BeomsToken";
    string public constant symbol = "BM";
    uint public constant decimals = 18;

    uint public constant INITIAL_SUPPLY = 10000 * (10 ** uint256(decimals));

    constructor() public{
        totalSupply_  = INITIAL_SUPPLY;
        balances[msg.sender] = INITIAL_SUPPLY;
        emit Transfer(0x0, msg.sender, INITIAL_SUPPLY);
    }
}
