// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "./Pools.sol";

contract PoolFactory {

	mapping(address => bool) public isInstantiated;
	mapping(address => address[]) public instantiations;
	address[] public allPoolInstantiations;
	mapping(address => address) poolToCreator; //mapping of pool address to creator address
	mapping(address => address) creatorToPool; //mapping of creator address to pool address

	event poolAddress(address _poolAddress, address[] _owners, uint8 _confirmations);

	function getInstantiationCount(address _creator) public view returns(uint) {
		return instantiations[_creator].length;
	}

	function getInstantiations(address _creator) public view returns(address[] memory) {
		return instantiations[_creator];
	}

	function getAllPoolInstantiations() public view returns(address[] memory) {
		return allPoolInstantiations;
	}

	function getCreator(address _poolAddress) public view returns(address) {
		return poolToCreator[_poolAddress];
	}

	function getPool(address _creator) public view returns(address) {
		return creatorToPool[_creator]; 
	}
 
	function createPool(address[] memory _owners, uint8 _confirmationsRequired, string memory _metadata, uint256 _ttl) public payable returns (address) {
		address poolContractAddress = address(new Pools(_owners, _confirmationsRequired, _metadata, _ttl));

		isInstantiated[poolContractAddress] = true;
		allPoolInstantiations.push(poolContractAddress);
		poolToCreator[poolContractAddress] = msg.sender;
		creatorToPool[msg.sender] = poolContractAddress;

		for(uint i = 0; i < _owners.length; i++) {
			instantiations[_owners[i]].push(poolContractAddress);
		}
		
		emit poolAddress(poolContractAddress, _owners, _confirmationsRequired);
		return poolContractAddress;
	}

}
