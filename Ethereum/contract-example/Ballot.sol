pragma solidity ^0.4.16;

// 컨트랙트 작성자가 의장 역할
// 투표권을 받은 주소의 사람들은 직접 투표하거나 신뢰할 수 있는 다른 사람에게 위임 가능.
/// @title 위임 투표
contract Ballot {
    // 이것은 나중에 변수에 사용될 새로운
    // 복합 유형 선언
    // 그것은 단일 유권자를 대표
    struct Voter {
        uint weight;    // weight 는 대표단에 의해 누적.
        bool voted;     // 만약 이 값이 true, 그 사람은 이미 투표.
        address delegate; // 투표에 위임된 사람.
        uint vote;      // 투표된 제안의 인덱스 데이터 값
    }

    // 이것은 단일 제안에 대한 유형.
    struct Proposal {
        bytes32 name;   // 간단한 명칭 (최대 32바이트)
        uint voteCount; // 누적 투표 수
    }

    address public chairperson;

    // 각각의 가능한 주소에 대해 'Voter' 구조체를 저장
    mapping(address => Voter) public voters;

    // 동적으로 크기가 지정된 'Proposal' 구조체의 배열
    Proposal[] public proposals;

    /// 'proposalNames' 중 하나를 선택하기 위한 새로운 투표권 생성
    function Ballot(bytes32[] proposalNames) public {
        chairperson = msg.sender;
        voters[chairperson].weight = 1;

        for(uint i = 0; i<proposalNames.length; i++) {
            proposals.push(Proposal({
                name:proposalNames[i],
                voteCount: 0
            }));
        }
    }

    // 'voter' 에게 이 투표권에 대한 권한을 부여
    // 오직 'chairperson'으로부터 호출받을 수 있음.
    function giveRightToVote(address voter) public {
        // 'require'가 false 로 평가되면, 모든 변경 내용을 state와 ether balance로 되돌림
        require(
            (msg.sender == chairperson) &&
            !voters[voter].voted &&
            (voters[voter].weight == 0)
        );
        voters[voter].weight = 1;
    }

    /// to 로 유권자에게 투표를 위임
    function delegate(address to) public {
        Voter storage sender = voters[msg.sender];
        require(!sender.voted);

        // 자체 위임은 허용 X
        require(to != msg.sender);

        // to가 위임하는 동안 delegation 전달
        // 오래 실행하면 많은 가스 필요하게 될 수 있음, 스마트 컨트랙트 완전 고착위험.
        while(voters[to].delegate != address(0)) {
            to = voters[to].delegate;

            // delegation에 루프가 있음을 확인 하고 허용하지 않았음.
            require(to != msg.sender);
        }

        sender.voted = true;
        sender.delegate = to;
        Voter storage delegate_ = voters[to];
        if(delegate_.voted) {
            // 대표가 이미 투표한 경우, 투표 수에 직접 추가
            proposals[delegate_.vote].voteCount += sender.weight;
        }
        else {
            // 대표가 아직 투표 X, weight에 추가
            delegate_.weight += sender.weight;
        }
    }

    /// (위임된 투표권을 포함)
    /// 'proposals[proposal].name' 제안서에 투표.
    function vote(uint proposal) public {
        Voter storage sender = voters[msg.sender];
        require(!sender.voted);
        sender.voted = true;
        sender.vote = proposal;

        // 범위 벗어나면 자동으로 throw 변경사항 되돌림.
        proposals[proposal].voteCount += sender.weight;
    }

    /// @dev 모든 이전 득표를 고려하여 승리한 제안서 계산
    function winningProposal() public view returns (uint winningProposal_) {
        uint winningVoteCount = 0;
        for(uint p = 0; p < proposals.length; p++) {
            if(proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
        return winningProposal_;
    }

    // winningProposal() 함수를 호출해 제안 배열에 포함된 승자의 index를 가져온 다음
    // 승자의 이름을 반환
    function winnerName() public view returns (bytes32 winnerName_) {
        winnerName_ = proposals[winningProposal()].name;
    }
}
