pragma solidity >=0.4.18 <=0.6.1;

contract HelloWorld {
    string public greeting;
    constructor() public {
        greeting = "Hello, World";
    }
    function say() public view returns (string memory) {
        return greeting;
    }
}