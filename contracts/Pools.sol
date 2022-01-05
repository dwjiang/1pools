// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract Pools {
	
	uint8 constant public NUM_OWNERS_MAXIMUM = 20;
	
	enum ProposalConfirmationTypes { UNDECIDED, YES, NO, ABSTAIN }
	
	struct Proposal {
		address payable destination;
		uint amount;
		bool executed;
		bytes data;
		mapping(address => ProposalConfirmationTypes) confirmations;
		mapping(ProposalConfirmationTypes => uint) numConfirmations;
	}
	
	address[NUM_OWNERS_MAXIMUM] private owners;
	mapping(address => bool) private isOwner;

	uint8 private confirmationsRequired;
	bytes private metadata;
	
	uint private numProposals;
	mapping(uint => Proposal) private proposals;
	mapping(uint => bool) private isProposal;

	// modifiers 
	modifier validNumOfOwners(uint _ownerCount) {
		require(_ownerCount <= NUM_OWNERS_MAXIMUM
			&& _ownerCount != 0);
		_;
	}

	modifier validConfirmationsRequired(uint _confirmationsRequired) {
		require(_confirmationsRequired >= 0);
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

	constructor(address[NUM_OWNERS_MAXIMUM] memory _owners, uint8 _confirmationsRequired, bytes memory _metadata) 
		validNumOfOwners(_owners.length)
		validConfirmationsRequired(_confirmationsRequired)
	{
		owners = _owners;
		confirmationsRequired = _confirmationsRequired;
		metadata = _metadata;
		for(uint i = 0; i < _owners.length; i++) {
			isOwner[_owners[i]] = true;
		}
	}
	
	function createProposal(address payable _destination, uint _amount, bytes memory _data) 
		public
		ownerExists(msg.sender)
	{
		Proposal storage proposal = proposals[numProposals++];
		isProposal[numProposals++] = true;
		proposal.destination = _destination;
		proposal.amount = _amount;
		proposal.data = _data;
		proposal.numConfirmations[ProposalConfirmationTypes.UNDECIDED] = owners.length;
	}
	
	function setConfirmation(uint _proposalId, ProposalConfirmationTypes _confirmation) 
		public 
		ownerExists(msg.sender)
	{
    	Proposal storage proposal = proposals[_proposalId];
		proposal.numConfirmations[proposal.confirmations[msg.sender]]--;
		proposal.confirmations[msg.sender] = _confirmation;
		proposal.numConfirmations[_confirmation]++;
	}
	
	function executeProposal(uint _proposalId) 
		public 
		proposalExists(_proposalId)
		ownerExists(msg.sender)
	{
    	Proposal storage proposal = proposals[_proposalId];
		if (proposal.numConfirmations[ProposalConfirmationTypes.YES] >= confirmationsRequired) {
			proposal.executed = true;
			proposal.destination.transfer(proposal.amount);
			(bool success, ) = proposal.destination.call{value: proposal.amount}(proposal.data);
			if (!success) {
				proposal.executed = false;
			} else {
				
			}
		}
	}

	// getters 
	function getNumOwners() public view returns (uint) {
		return owners.length;
	}
	
	function getOwners() public view returns (address[NUM_OWNERS_MAXIMUM] memory) {
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
		
	function getProposal(uint _proposalId) public view returns (address, uint, bool) {
    Proposal storage proposal = proposals[_proposalId];
		return (proposal.destination, proposal.amount, proposal.executed);
	}
		
	function getConfirmationsRequired() public view returns (uint) {
		return confirmationsRequired;
	}
	
	function getMetadata() public view returns (bytes memory) {
		return metadata;
	}
}
