// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Pools {
	
	
	enum ProposalConfirmationTypes { UNDECIDED, YES, NO, ABSTAIN }
	
	struct Proposal {
		uint256 creationTime;
		address payable destination;
		address creator;
		uint amount;
		bool executed;
		bytes data;
		mapping(address => ProposalConfirmationTypes) confirmations;
		mapping(ProposalConfirmationTypes => uint) numConfirmations;
	}
	
	address[] private owners;
	mapping(address => bool) private isOwner;

	uint8 private confirmationsRequired;
	string private metadata;

	uint256 private poolTTL; //current pool's time to live measured by days
	uint256 private poolCreationTime;

	uint private numProposals;
	mapping(uint => Proposal) private proposals;
	mapping(uint => bool) private isProposal;

	modifier validNumOfOwners(uint _ownerCount) {
		require(_ownerCount != 0);
		_;
	}

	modifier validConfirmationsRequired(uint _confirmationsRequired) {
		require(_confirmationsRequired >= 0);
		_;
	}

	modifier validTTL(uint256 _ttl) {
		require(_ttl > 0);
		_;
	}

	modifier validPoolTimeWindow() {
		require(block.timestamp > (poolTTL * 24 * 60 * 60 + poolCreationTime));
		_;
	}

	modifier proposalExists(uint _proposalId) {
		require(isProposal[_proposalId]);
		_;
	}

	modifier ownerExists(address _owner) {
		require(isOwner[_owner]);
		_;
	} 

	constructor(address[] memory _owners, uint8 _confirmationsRequired, string memory _metadata, uint256 _ttl) 

		validNumOfOwners(_owners.length)
		validConfirmationsRequired(_confirmationsRequired)
		validTTL(_ttl)
	{
		owners = _owners;
		confirmationsRequired = _confirmationsRequired;
		metadata = _metadata;
		poolTTL = _ttl;
		poolCreationTime = block.timestamp;

		for(uint i = 0; i < _owners.length; i++) {
			isOwner[_owners[i]] = true;
		}
	}
	
	function createProposal(address payable _destination, uint _amount, bytes memory _data) 
		public
		ownerExists(msg.sender)
	{
		Proposal storage proposal = proposals[numProposals++];
		isProposal[numProposals] = true;
		proposal.destination = _destination;
		proposal.amount = _amount;
		proposal.data = _data;
		proposal.numConfirmations[ProposalConfirmationTypes.UNDECIDED] = owners.length;
		proposal.creator = msg.sender;
		proposal.creationTime = block.timestamp;
	}
	
	function setConfirmation(uint _proposalId, ProposalConfirmationTypes _confirmation) 
		public payable
		ownerExists(msg.sender)
	{
		Proposal storage proposal = proposals[_proposalId];
		proposal.numConfirmations[proposal.confirmations[msg.sender]]--;
		proposal.confirmations[msg.sender] = _confirmation;
		proposal.numConfirmations[_confirmation]++;
	}
	
	function executeProposal(uint _proposalId) 
		public payable
		proposalExists(_proposalId)
		ownerExists(msg.sender)
		validPoolTimeWindow()
	{
		Proposal storage proposal = proposals[_proposalId];
		if (proposal.numConfirmations[ProposalConfirmationTypes.YES] >= confirmationsRequired) {
			proposal.executed = true;
			proposal.destination.transfer(proposal.amount);
			(bool success, ) = proposal.destination.call{value: proposal.amount}(proposal.data);
			if (!success) {
				proposal.executed = false;
			}
		}
	}
	// getters 
	function getNumOwners() public view returns (uint) {
		return owners.length;
	}
	
	function getOwners() public view returns (address[] memory) {
		return owners;
	}
	
	function getNumProposals() public view returns (uint) {
		return numProposals;
	}
	
	function getOwnerConfirmation(uint _proposalId, address _owner) public view returns (ProposalConfirmationTypes) {
		Proposal storage proposal = proposals[_proposalId];
		return proposal.confirmations[_owner];
	}
	
	function getProposalNumConfirmations(uint _proposalId, ProposalConfirmationTypes _proposalConfirmationTypes) public view returns (uint) {
		Proposal storage proposal = proposals[_proposalId];
		return proposal.numConfirmations[_proposalConfirmationTypes];
	}
		
	function getProposal(uint _proposalId) public view returns (address, uint, bool, bytes memory, uint256, address) {
		Proposal storage proposal = proposals[_proposalId];
		return (proposal.destination, proposal.amount, proposal.executed, proposal.data, proposal.creationTime, proposal.creator);
	}
		
	function getConfirmationsRequired() public view returns (uint) {
		return confirmationsRequired;
	}
	
	function getMetadata() public view returns (string memory) {
		return metadata;
	}

	function getPoolCreatedTime() public view returns(uint256) {
		return poolCreationTime;
	}

	function getPoolTTL() public view returns(uint256) {
		return poolTTL;
	}
}
