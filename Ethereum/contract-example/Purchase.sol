pragma solidity ^0.4.21;

contract Purchase {
    uint public value;
    address public seller;
    address public buyer;
    enum State { Created, Locked, Inactive }
    State public state;

    // `msg.value`가 짝수임을 확실히 기억.
    // 만약 홀수라면 분할은 길이를 줄임.
    // 곱셈을 통해 이것이 홀수가 아닌지 확인.
    function Purchase() public payable {
        seller = msg.sender;
        value = msg.value / 2;
        require((2 * value) == msg.value);
    }

    modifier condition(bool _condition) {
        require(_condition);
        _;
    }

    modifier onlyBuyer() {
        require(msg.sender == buyer);
        _;
    }

    modifier onlySeller() {
        require(msg.sender == seller);
        _;
    }

    modifier inState(State _state) {
        require(state == _state);
        _;
    }

    event Aborted();
    event PurchaseConfirmed();
    event ItemReceived();

    // 구매를 중단하고 이더를 회수.
    // 컨트랙트가 잠기기 전에 판매자에 의해서만
    // 호출
    function abort() public onlySeller inState(State.Created) {
        emit Aborted();
        state = State.Inactive;
        seller.transfer(this.balance);
    }

    // 구매자로서 구매를 확정
    // 트랜잭션은 `2 * value * ether 을 포함해야 한다.
    // 이 이더는 confirmReceived() 가 호출될 때까지
    // 잠길 것이다.
    function confirmPurchase() public inState(State.Create) condition(msg.value == (2 * value)) payable {
        emit PurchaseConfirmed();
        buyer = msg.sender;
        state = State.Locked;
    }

    // 구매자가 아이템을 받았다고 확인.
    // 이것은 잠긴 이더를 끌어줄 것.
    function confirmReceived() public onlyBuyer inState(State.Locked) {
        emit ItemReceived();
        // 먼저 상태를 변경하는 것이 중요.
        // 그렇지 않으면, send를 사용하며 호출된 컨트랙트는 다시 여기를 호출할 수 있음.
        state = State.Inactive;

        // Note: 이것은 실제로 구매자와 판매자 둘다 환급 하는 것을 막을 수 있도록 함. - 출근 패턴이 사용되어야만 함.

        buyer.transfer(value);
        seller.transfer(this.balance);
    }
}
