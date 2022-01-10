// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "./Pools.sol";

contract PoolFactory {

	mapping(address => bool) public isInstantiated;
	mapping(address => address[]) public instantiations;
	address[] public allPoolInstantiations;
	address public poolCreator; 

	event instantiationCount(address _creator);
	event instantiationsOfCreator(address _creator);
	event allCreatedPools(address[] _allPoolInstantiations);
	event poolAddress(address _poolAddress, address[] _owners, uint8 _confirmations);
	event createdBy(address _poolCreator);


	function getInstantiationCount(address _creator) public returns(uint) {
		emit instantiationCount(_creator);
		return instantiations[_creator].length;
	}

    function getInstantiations(address _creator) public returns(address[] memory) {
		emit instantiationsOfCreator(_creator);
		return instantiations[_creator];
	}

	function getAllPoolInstantiations() public returns(address[] memory) {
		emit allCreatedPools(allPoolInstantiations);
		return allPoolInstantiations;
	}

	function getCreator() public returns(address) {
		emit createdBy(poolCreator);
		return poolCreator;
	}
 
	function createPool(address[] memory _owners, uint8 _confirmationsRequired, string memory _metadata) public payable returns (address) {
		address poolContractAddress = address(new Pools(_owners, _confirmationsRequired, _metadata));
		isInstantiated[poolContractAddress] = true;
		allPoolInstantiations.push(poolContractAddress);
		poolCreator = msg.sender;
		for(uint i = 0; i < _owners.length; i++) {
			instantiations[_owners[i]].push(poolContractAddress);
		}
		emit poolAddress(poolContractAddress, _owners, _confirmationsRequired);
        return poolContractAddress;
	}

}