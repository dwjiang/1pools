// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
import "./Factory.sol";
import "./Pools.sol";

contract PoolFactory is Factory{

	function createPool(address[20] memory _owners, uint8 _confirmationsRequired, bytes memory _metadata) public returns (address poolContractAddress){
		poolContractAddress = address(new Pools(_owners, _confirmationsRequired, _metadata));
		addInstantiation(poolContractAddress);
	}

}