// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "./Pools.sol";

contract PoolFactory {

	mapping(address => bool) public isInstantiated;
	mapping(address => address[]) public instantiations;
	address[] public allPoolInstantiations; 

	function getInstantiationCount(address _creator) public view returns(uint) {
		return instantiations[_creator].length;
	}

    function getInstantiations(address _creator) public view returns(address[] memory) {
		return instantiations[_creator];
	}

	function getAllPoolInstantiations() public view returns(address[] memory) {
		return allPoolInstantiations;
	}
 
	function createPool(address[] memory _owners, uint8 _confirmationsRequired, string memory _metadata) public payable returns (address){
		address poolContractAddress = address(new Pools(_owners, _confirmationsRequired, _metadata));
		isInstantiated[poolContractAddress] = true;
		allPoolInstantiations.push(poolContractAddress);
		for(uint i = 0; i < _owners.length; i++) {
			instantiations[_owners[i]].push(poolContractAddress);
		}
        return poolContractAddress;
	}

}