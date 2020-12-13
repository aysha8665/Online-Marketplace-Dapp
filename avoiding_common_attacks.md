# Avoiding Common Attacks

## Reentrancy
Zeppelin's `ReentrancyGuard` library is extended to the `Marketplace.sol` contract. 

Contract module that helps prevent reentrant calls to a function.

Inheriting from ReentrancyGuard will make the nonReentrant modifier available, which can be applied to functions to make sure there are no nested (reentrant) calls to them.

The ReentrancyGuard functions have the `nonReentrant` modifier. 

## External Calls
The external calls made by a contract is from the Stores to Marketplace contract (in onlyMarketAdmin and onlyStoreOwner). The address of the Marketplace contract is set by the owner (i.e. the address that deploys the contract) in the constructor, and there is no way to change it. If a user trusts the addresses that have deployed the contracts, then the external call should be reasonably safe.

## Avoid state changes after external calls
The only state change after an external call is in createStorefront in Stores.sol, because it is necessary to check in the Marketplace contract whether an address is marked as a storeOwner. For security purposes, this function (as well as all others that modify state) is pausable by the owner of the contract because of the whenNotPaused modifier.