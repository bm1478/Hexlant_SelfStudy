pragma solidity ^0.4.21;
// 경매 기간 마감에 대한 압박이 없음
// 경매 기간동안 가격 제시자들은 해쉬 버전을 관찰, 경매 기간이 끝난 후, 가격을 제시한 것을 드러내서
// 보낸 암호화되지 않은 값을 해쉬한 값이 일치하는지 확인
// 경매에서 이긴 후 돈을 보내는 것을 막기 위해 가격 제시와 함께 돈을 보내게 함.
// 블라인드가 안되는 것을 '가장 큰 가격제시보다 더 큰 어떤 값이든 수락 함으로써 해결'

contract BlindAuction {
    struct Bid {
        bytes32 blindedBid;
        uint deposit;
    }

    address public beneficiary;
    uint public biddingEnd;
    uint public revealEnd;
    bool public ended;

    mapping(address => Bid[]) public bids;

    address public highestBidder;
    uint public highestBid;

    // 이전 가격 제시의 허락된 출금
    mapping(address => uint) pendingReturns;

    event AuctionEnded(address winner, uint highestBid);

    /// Modifier는 함수 입력값을 입증하는 편리한 방법
    /// 'onlyBefore'은 아래의 'bid'에 적용 되어 질 수 있음.
    /// 이 새로운 함수 몸체는 '_'이 오래딘 함수몸체를 대체하는 modifer의 몸체
    modifier onlyBefore(uint _time) { require(now < _time); _; }
    modifier onlyAfter(uint _time) { require(now > _time); _; }

    function BlindAuction(
        uint _biddingTime,
        uint _revealTime,
        address _beneficiary
    ) public {
        beneficiary = _beneficiary;
        biddingEnd = now + _biddingTime;
        revealEnd = biddingEnd + _revealTime;
    }

    /// `_blindedBid` = kecckak256(value, fake, secret) 와 함께 가려진(blinded) 가겨을 제시
    /// 만약 가격 제시가 드러내는 단계에서 올바르게 보여진다면 보내진 이더는 환급 받을 수만 있음.
    /// 가격 제시와 함께 보내진 이더는 적어더 'value, 'fake' 는 참.
    /// 'fake'를 참으로 설정하고 정확하지 않은 양을 보내는 것은 진짜 가격제시를 숨기는 방법, 여전히 요구되는 출금을 함.
    /// 같은 주소는 여러 가격 제시들을 둘 수 있음.
    function bid(bytes32 _blindedBid) public payable onlyBefore(biddingEnd) {
        bids[msg.sender].push(Bid({
            blindedBid: _blindedBid,
            deposit: msg.value
        }));
    }

    /// 가려진 가격 제시를 드러냄.
    // 알맞게 가려진 유효하지 않은 가격 제시들을 되돌려 받을 것. 가장 높은 가격 제시를 제외하고 모든 가격 제시도 돌려 받을 것
    function reveal(uint[] _values, bool[] _fake, bytes32[] _secret) public onlyAfter(biddingEnd)onlyBefore(revealEnd) {
        uint length = bids[msg.sender].length;
        require(_values.length == length);
        require(_fake.length == length);
        require(_secret.length == length);

        uint refund;
        for (uint i = 0; i< length; i++) {
            var bid = bids[msg.sender][i];
            var (value, fake, secret) = (_values[i], _fake[i], _secret[i]);
            if(bid.blindedBid != keccak256(value, fake, secret)) {
                continue;
            }
            refund += bid.deposit;
            if(!fake && bid.deposit >= value) {
                if(placeBid(msg.sender, value))
                    refund -= value;
            }
            bid.blindedBid = bytes32(0);
        }
        msg.sender.transfer(refund);
    }

    // 컨트랙트 안에서 이것 스스로만 호출될 수 있다는 의미 'internal'
    function placeBid(address bidder, uint value) interval returns(bool success) {
        if (value <= highestBid) {
            return false;
        }
        if (highestBidder != 0) {
            // 이전에 가장 높은 가격 제시를 환급
            pendingReturns[highestBidder] += highestBid;
        }
        highestBid = value;
        highestBidder = bidder;
        return true;
    }

    // Withdraw a bid that was overbid
    function withdraw() publid {
        uint amount = pendingReturns[msg.sender];
        if(amount > 0) {
            // 0으로 설정하는 것이 중요한 이유는 수신사가 'transfer' 반환 값을 받기 전에 함수를 또 호춣할 수 있기 때문이다.
            pendingReturns[msg.sender] = 0;
            msg.sender.transfer(amount);
        }
    }

    /// 경매를 끝내고 가장 높은 가격 제시를 수혜자에게 송금합니다.
    function auctionEnd() public onlyAfter(revealEnd) {
        require(!ended);
        emit AuctionEnded(highestBidder, highestBid);
        ended = true;
        beneficiary.transfer(highestBid);
    }
}
