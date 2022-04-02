// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";

contract MemberVotes is Ownable {
    event VoteCasted(uint totalVotes);

    string public proposalName;
    uint public totalvotes;

    struct Member {
        bool hasVoted;
        bool exists;
    }

    mapping(address => Member) public members;

    function setProposalName(string memory _name) public onlyOwner {
        proposalName = _name;
    }

    function addMember(address _voterAddress) public onlyOwner {
        members[_voterAddress].exists = true;
    }

    function isMember(address _voterAddress) public view returns(bool){
         return members[_voterAddress].exists;
    }

    function vote() external {
         require(
             !members[msg.sender].hasVoted,
             "You have already voted!"
         );
         members[msg.sender].hasVoted = true;
         totalvotes++;
         emit VoteCasted(totalvotes);
    }

}