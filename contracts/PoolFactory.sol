// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
import "./Pools.sol";

contract PoolFactory {

	mapping(address => bool) public isInstantiated;
	mapping(address => address[]) public instantiations;

	function getInstantiationCount(address _creator) public view returns(uint) {
		return instantiations[_creator].length;
	}

	function createPool(address[20] memory _owners, uint8 _confirmationsRequired, bytes memory _metadata) public returns (address poolContractAddress){
		poolContractAddress = address(new Pools(_owners, _confirmationsRequired, _metadata));
		isInstantiated[poolContractAddress] = true;
		instantiations[msg.sender].push(poolContractAddress);
	}

}