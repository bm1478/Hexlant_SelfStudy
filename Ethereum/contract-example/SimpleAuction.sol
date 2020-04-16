pragma solidity ^0.4.21;
// 간단한 경매 컨트랜트: 경매기간동안 모든 사람이 그들의 가격제시를 전송할 수 있음.
// 가격제시는 돈이나 이더 송금 포함, 최고 제시 가격 올라가면 돈 돌려받음
// 제시 기간 끝난 후 컨트랙트는 돈 받는 사람을 위해 수동으로 호출되어야함.

contract SimpleAuction {
    // 옥션의 파라미터, 시간은 아래 둘 중에 하나
    // 앱솔루트 유닉스 타임스탬프 (seconds since 1970-01-01), 시한 (time period) in seconds
    address public beneficiary;
    uint public auctionEnd;

    // 옥션의 현재 상황
    address public highestBidder;
    uint public highestBid;

    // 이전 가격 제시들의 수락된 출금
    mapping(address => uint) pendingReturns;

    // 마지막에 true 로 설정, 어떠한 변경 허락 안됨.
    bool ended;

    // 변경에 발생하는 이벤트
    event HighestBidIncreased(address bidder, uint amount);
    event AuctionEnded(address winner, uint amount);

    // 'natspec' 이라고 불리우는 코멘트,
    // 3개의 슬래시로 알아볼 수 있음
    // 유저가 트랜잭션에 대한 확인을 요청 받을 때 보여짐.

    /// 수혜자의 주소를 대신하여 두번째 가격제시 기간 '_biddingTime'과
    /// 수혜자의 주소 '_beneficiary' 를 포함하는
    /// 간단한 옥션을 제작
    function SimpleAuction(
        uint _biddingTime,
        address _beneficiary
    ) public {
        beneficiary = _beneficiary;
        auctionEnd = now + _biddingTime;
    }

    /// 경매에 대한 가격제시와 값은
    /// 이 transaction 과 함께 보내짐.
    /// 값은 경매에서 이기지 못했을 경우만
    /// 반환 받을 수 있음
    function bid() public payable {
        // 어떤 인자도 필요하지 않음, 모든 정보는 이미 트랜잭션의 일부
        // 'payable' 키워드는 이더를 지급하는 것이 가능하도록 하기 위해 요구됨.

        // 경매 기간이 끝났으면 되돌아감.
        require(now <= auctionEnd);

        // 가격제시가 더 높지 않다면 돈을 돌려보냄.
        require(msg.value > highestBid);

        if(highestBid != 0) {
            // 간단히 highestBidder.send(highestBid)를 사용하여 돈을 돌려 보내는 것은 보안상 리스트
            // 신뢰되지 않은 컨트랙트를 실행 시킬 수 있기 때문에
            // 받는 사람이 그들의 돈을 스스로 출금하도록 하는 것이 이상적.
            pendingReturns[highestBidder] += highestBid;
        }
        highestBidder = msg.sender;
        highestBid = msg.value;
        emit HighestBidIncreased(msg.sender, msg.value);
    }

    /// 비싸게 값이 불러진 가격제시 출금
    function withdraw() public returns (bool) {
        uint amount = pendingReturns[msg.sender];
        if(amoung > 0) {
            // 받는 사람이 이 'send' 반환 이전에 받는 호출의 일부, 이 함수를 다시 호출할 수 있기 때문에
            // 0으로 설정하는 것이 중요
            pendingReturns[msg.sender] = 0;

            if(!msg.sender.send(amount)) {
                // 여기서 throw 호출 필요 없음, 빚진 양만 초기화
                pendingReturns[msg.sender] = amount;
                return false;
            }
        }
        return true;
    }

    /// 경매를 끝내고 최고 가격 제시를 수혜자에게 송금
    function auctionEnd() public {
        // 3가지 단계:
        // 1. 조건 확인
        // 2. 동작 수행 (잠재적으로 변경)
        // 3. interacting with other contracts

        // 1. 조건
        require(now >= auctionEnd); // auction did not yet end
        require(!ended); // this function has already been called

        // 2. 영향
        ended = true;
        emit AuctionEnded(highestBidder, highestBid);

        // 3. 상호작용
        beneficiary.transfer(highestBid);
    }
}
