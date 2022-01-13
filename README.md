# 1pools 🏊‍♂️ – Harmony One Hackathon 
By Daniel Jiang and Kelly Wang

Checkout our live site at [1pools.xyz](http://www.1pools.xyz).<br/>
View a sample pool [here](http://1pools.xyz/pools/one1mtmqm72l4yeugg00e4um7dh2cflptwgq8fhjz9) and our video demo [here](https://youtu.be/OSABNICJe24).<br/>
Smart Contract Address: [one12fj86y4duztz0hfrwyldnqr35tyf4tqckwgl66](https://explorer.pops.one/address/0x52647d12ade09627dd23713ed98071a2c89aac18) (on the Harmony One Testnet)

## What is it?
**Pooling service that allows groups to use the ONE token to delegate cash flow collectively using multi-signature wallets.**<br/>
<br/>
Currently, we have a great variety of group fundraising financial services such as Venmo, PayPal, GoFundMe, etc. to choose from, but a common theme amongst these services is that there is usually only one "owner"; only one person is in charge of all the funds. We wanted to expand on the idea of decentralized finance to better fit our day to day scenarios and allow everyone in a group an equal stance by using a voting system.

1pools is a decentralized service for group fundraising/payment splitting, running on the Harmony One Blockchain. You can use 1pools to fundraise specific items or events like birthday parties, group trips, or even group rent payments.

## How does it work?
Beneath the hood, a pool is essentially a multi-signature wallet, shared between all specified "owners" of the pool. Given that every 1pool is a public address, anyone, even those who are not owners, can contribute $ONE to the pool. During pool creation, you can specify pool details, owners, and voting rules for proposals of the pool. Each pool will require a name, description, goal amount, and duration. The duration ensures that no proposals will be executed until after the pool closes. Since the pool's wallet address is public on the blockchain, we can't prevent users from contributing after the deadline, but this limitation on the proposal execution order can add withdrawl protection up to the end date.

Pool proposals are basically proposed transactions to send the $ONE stored inside the pool to a specified destination wallet. In order to pass and execute a proposal, the proposal would need to reach a certain number of yes votes, which is specified at the time of pool creation.

Having owner privilege not only will give access to the pool's update section, but also allow them to create proposals and cast votes on these proposals. For example, given a pool has 5 owners and the minimum owners needed to pass a proposal is set to 3, every proposal will require at least 3 yes votes in order for the proposal to be executed.

Proposals, voting, and most pool information are stored on-chain. The name, description, and goal amount of the pool are stored in IPFS. Comments, however, are stored off-chain in a centralized server.

## Getting Started
1. Visit http://www.1pools.xyz.
2. Connect your Harmony Wallet Chrome Extension.
3. Go to the "Create Pool" page.
4. Enter the general information for your pool.
![](/pics/createpool.png)
5. Enter the pool's owners and the minimum number of owners required to pass and execute a proposal.
![](/pics/createpool2.png)

Upon review and submit, the pool is then created and now can accept contributions, updates, proposals, comments, etc. 
![](/pics/createpool3.gif)


## Technical Details
### Frontend/Backend
#### Client
The client is built using ReactJS CRA. The client is the basic interface for users to interact with the smart contract. 

#### Server
The server a REST API created using NodeJS. The purpose of the server is to store the pool updates, comments, and number of views a pool has; everything about the pool is either stored in the smart contract itself or stored on IPFS.

The updates and comments uploaded are verified by having the sender verify their identity by signing a randomly generated 16 byte hexadecimal nonce; every time the user make a successful transaction with the server, the nonce is randomly generated again.

As storing the pool data onto IPFS, the client would send the JSON to the server to be verified and sent to Pinata so they can pin the JSON data onto IPFS for us.

![](/pics/diagram2.png)

### Smart Contract
#### Overview
The current smart contract follows a factory pattern with an underlying multisig wallet contract, using solidity version `0.8.7` and up. The `PoolFactory.sol` contract is used for calling the `Pools` constructor and instantiating pools, it also keeps track of all the created pool address of a given owner along with the creator. The `Pools.sol` contract is mainly used for regulating the state of all the proposals of a given pool. These proposals allow different liquidity functionalities of the wallet's funds proposed by an owner and thus allow the participants to cast their votes. The users then have the freedom to decide how many confirmation is needed for a proposal to pass. Once the number of confirmations required is met, the amount in the proposal will be sent a delegated owner set in the proposal. Note that proposals can only be executed after the pool's contribution period closes to prevent unwanted fund locking.

![](/pics/diagram.png)

#### Testing and Deployment 
To try out the smart contracts, one can use an online solidity IDE: [**remix**](https://remix.ethereum.org/). Note: to use the pool created from `PoolFactory.sol` one would have to use that pool address upon deploying `Pools.sol` 
<br></br>
Deploy to testnet using Truffle:
1. install harmony dependencies 
```
npm install --save @harmony-js/core
npm install --save @harmony-js/utils
npm install --save tslib
npm install --save dotenv
```
2. download harmony one wallet chrome extension and create `.env` with mnemonic and private key, for more information check out [harmony one documentation](https://docs.harmony.one/home/developers/deploying-on-harmony/truffle/setup)
3. edit `truffle-config.js` and set the appropriate version number for the compilers block. 
4. `truffle migrate  --network testnet --reset`

## TODOs/ Nice to Haves
- Finish the "My Pools" page
- Likes/dislikes for comments, updates, and proposals
- Delete comments 
- Server-side pagination for comments, updates, and proposals
- Ability to add and remove owners, change the minimum number owners required to pass a proposal, and change pool information (through proposals, of course)
- Spam prevention/rate limiting for server routes
- Money dispersal back to contributers if goal not met
- Show conversion to local currency while contributing
- Show vote and donation history
- Expiration date for proposal to reduce out of date proposal from execution 
- Tags for the pools
