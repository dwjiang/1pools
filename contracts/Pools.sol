// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Pools {
	
	
	enum ProposalConfirmationTypes { UNDECIDED, YES, NO, ABSTAIN }
	
	struct Proposal {
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
	
	uint private numProposals;
	mapping(uint => Proposal) private proposals;
	mapping(uint => bool) private isProposal;

	event ownersCount(uint _count);
	event getAllOwners(address[] _owners);
	event proposalCount(uint _count);
	event ownerConfirmationTypes(ProposalConfirmationTypes _confirmationTypes);
	event proposalConfirmationCount(uint _count);
	event proposalInfo(address _destionation, uint _amount, bool _executed);
	event confirmationRequiredCount(uint _count);
	event metadataInfo(string _metadata);
	event proposalCreatedBy(address _creator);


	modifier validNumOfOwners(uint _ownerCount) {
		require(_ownerCount != 0);
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

	constructor(address[] memory _owners, uint8 _confirmationsRequired, string memory _metadata) 

		validNumOfOwners(_owners.length)
		validConfirmationsRequired(_confirmationsRequired)
	{
        // require(_owners[0] == msg.sender);
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
		isProposal[numProposals] = true;
		proposal.destination = _destination;
		proposal.amount = _amount;
		proposal.data = _data;
		proposal.numConfirmations[ProposalConfirmationTypes.UNDECIDED] = owners.length;
		proposal.creator = msg.sender;
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
			}
		}
	}

	// getters 
	function getNumOwners() public returns (uint) {
		emit ownersCount(owners.length);
		return owners.length;
	}
	
	function getOwners() public returns (address[] memory) {
		emit getAllOwners(owners);
		return owners;
	}
	
	function getNumProposals() public returns (uint) {
		emit proposalCount(numProposals);
		return numProposals;
	}
	
	function getOwnerConfirmation(uint _proposalId, address _owner) public returns (ProposalConfirmationTypes) {
		Proposal storage proposal = proposals[_proposalId];
		emit ownerConfirmationTypes(proposal.confirmations[_owner]);
		return proposal.confirmations[_owner];
	}
	
	function getProposalNumConfirmations(uint _proposalId, ProposalConfirmationTypes _proposalConfirmationTypes) public returns (uint) {
		Proposal storage proposal = proposals[_proposalId];
		emit proposalConfirmationCount(proposal.numConfirmations[_proposalConfirmationTypes]);
		return proposal.numConfirmations[_proposalConfirmationTypes];
	}
		
	function getProposal(uint _proposalId) public returns (address, uint, bool) {
		Proposal storage proposal = proposals[_proposalId];
		emit proposalInfo(proposal.destination, proposal.amount, proposal.executed);
		return (proposal.destination, proposal.amount, proposal.executed);
	}
		
	function getConfirmationsRequired() public returns (uint) {
		emit confirmationRequiredCount(confirmationsRequired);
		return confirmationsRequired;
	}
	
	function getMetadata() public returns (string memory) {
		emit metadataInfo(metadata);
		return metadata;
	}

	function getProposalCreator(uint _proposalId) public returns (address) {
		Proposal storage proposal = proposals[_proposalId];
		emit proposalCreatedBy(proposal.creator);
		return proposal.creator;
	}
}
