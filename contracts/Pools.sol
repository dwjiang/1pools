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
	uint8 private confirmationsRequired;
	bytes private metadata;
	
	uint private numProposals;
	mapping(uint => Proposal) private proposals;

	constructor(address[NUM_OWNERS_MAXIMUM] memory _owners, uint8 _confirmationsRequired, bytes memory _metadata) {
		owners = _owners;
		confirmationsRequired = _confirmationsRequired;
		metadata = _metadata;
	}
	
	function createProposal(address payable _destination, uint _amount, bytes memory _data) public {
		Proposal storage proposal = proposals[numProposals++];
		proposal.destination = _destination;
		proposal.amount = _amount;
		proposal.data = _data;
		proposal.numConfirmations[ProposalConfirmationTypes.UNDECIDED] = owners.length;
	}
	
	function setConfirmation(uint _proposalId, ProposalConfirmationTypes _confirmation) public {
		proposals[_proposalId].numConfirmations[proposals[_proposalId].confirmations[msg.sender]]--;
		proposals[_proposalId].confirmations[msg.sender] = _confirmation;
		proposals[_proposalId].numConfirmations[_confirmation]++;
	}
	
	function executeProposal(uint _proposalId) public {
		if (proposals[_proposalId].numConfirmations[ProposalConfirmationTypes.YES] >= confirmationsRequired) {
			proposals[_proposalId].executed = true;
			proposals[_proposalId].destination.transfer(proposals[_proposalId].amount);
			(bool success, ) = proposals[_proposalId].destination.call{value: proposals[_proposalId].amount}(proposals[_proposalId].data);
			if (!success) {
				proposals[_proposalId].executed = false;
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
		return proposals[_proposalId].confirmations[_owner];
	}
	
	function getProposalNumConfirmations(uint _proposalId, ProposalConfirmationTypes _proposalConfirmationTypes) public view returns (uint) {
		return proposals[_proposalId].numConfirmations[_proposalConfirmationTypes];
	}
		
	function getProposal(uint _proposalId) public view returns (address, uint, bool) {
		return (proposals[_proposalId].destination, proposals[_proposalId].amount, proposals[_proposalId].executed);
	}
		
	function getConfirmationsRequired() public view returns (uint) {
		return confirmationsRequired;
	}
	
	function getMetadata() public view returns (bytes memory) {
		return metadata;
	}
}
