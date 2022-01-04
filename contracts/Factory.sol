// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract Factory {

	mapping(address => bool) public isInstantiated;
	mapping(address => address[]) public instantiations;

	function getInstantiationCount(address _creator) public view returns(uint) {
		return instantiations[_creator].length;
	}

	function addInstantiation(address _pool) internal {
		isInstantiated[_pool] = true;
		instantiations[msg.sender].push(_pool);
	}

}