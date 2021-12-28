pragma solidity ^0.8.10;

contract Pools {
    mapping(address => address[]) private pool_to_owners;
    mapping(address => address[]) private owner_to_pools;
    mapping(address => bytes) private pool_to_metadata;

	constructor(address _pool_addr, address _owner_addr, bytes memory _metadata) public {
		/*
			- constructor takes in owners to create wallet and adds to lookup table then calls multisig wallet
		*/
        pool_to_owners[_pool_addr].push(address(_owner_addr));
        pool_to_metadata[_pool_addr] = _metadata;
        owner_to_pools[_owner_addr].push(address(_pool_addr));
	} 

    function addOwner(address pool_addr, address [] memory owners_addr) public {
        for (uint i = 0; i < owners_addr.length; i++) {
            pool_to_owners[pool_addr].push(owners_addr[i]);
            owner_to_pools[owners_addr[i]].push(pool_addr);
        }
    }

    // getters 
    function getOwners(address pool_addr) public view returns (address [] memory) {
        return pool_to_owners[pool_addr];
    }

    function getPools(address owner_addr) public view returns (address [] memory) {
        return owner_to_pools[owner_addr];
    }

    /*
    	TODO:
    		- allow owner x to send funds to pool 
    		- trigger multisig for withdrawling from fund 
    		- select delegate of pool 
    */

}

contract MultiSigWallet {
	uint constant public MIN_CONSENT = 1; // 100% agreement upon owners to withdrawl funds 
}

// contract MultiSigWallet {
// 	function submitTransaction() {
// 		/*
// 			owner will propose a transaction subject to approval by other owners
// 		*/

// 	}

// 	function confirmTransaction() {
		
// 			other owners can approve or deny the transaction proposal 
		

// 	}

// 	function executeTransaction() {
// 		/*
// 			if enough owners approve the transaction, it will be executed 
// 		*/

// 	}

// 	function revokeConfirmation() {
// 		/*
// 			allow an owner to cancel the confirmation  
// 		*/

// 	}
// }