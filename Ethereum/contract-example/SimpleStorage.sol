pragma solidity >=0.4.0 <0.6.0;
// Solidity 0.4.0 버전을 기반으로 작성, 이후 버전(0.6.0)에서도 정상 동작
// 새로운 컴파일러 버전에서 컴파일 하지 못함.
// uint(256비트의 부호없는 양의 정수)

contract SimpleStorage {
    uint storedData;

    function set(uint x) public  {
        storedData = x;
    }

    function get() public view returns (uint) {
        return storedData;
    }
}
