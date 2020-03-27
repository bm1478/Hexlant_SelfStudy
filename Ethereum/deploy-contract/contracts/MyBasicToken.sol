pragma solidity ^0.4.0;

import "./BasicToken.sol";

contract MyBasicToken is BasicToken {
    uint8 public constant decimals = 18;
    uint256 public constant INITIAL_SUPPLY = 10000 * (10 ** uint256(decimals));

    /**
    Constructor that gives msg.sender all of existing tokens.
    */
    constructor() public{
        totalSupply_ = INITIAL_SUPPLY;
        balances[msg.sender] = INITIAL_SUPPLY;
        emit Transfer(0x0, msg.sender, INITIAL_SUPPLY);
    }
}
