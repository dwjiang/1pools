// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "./Pools.sol";

contract PoolFactory {

	mapping(address => bool) public isInstantiated;
	mapping(address => address[]) public instantiations;

	function getInstantiationCount(address _creator) public view returns(uint) {
		return instantiations[_creator].length;
	}

    function getInstantiations(address _creator) public view returns(address[] memory) {
		return instantiations[_creator];
	}

	function createPool(address[] memory _owners, uint8 _confirmationsRequired, string memory _metadata) public payable returns (address){
		address poolContractAddress = address(new Pools(_owners, _confirmationsRequired, _metadata));
		isInstantiated[poolContractAddress] = true;
		instantiations[msg.sender].push(poolContractAddress);
        return poolContractAddress;
	}

}