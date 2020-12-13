# Design Pattern Decisions

## Circuit Breaker
Zeppelin's `Pausable` library is extended to the `Marketplace.sol` contract. 

OpenZeppelin Contracts helps you minimize risk by using battle-tested libraries of smart contracts for Ethereum and other blockchains. It includes the most used implementations of ERC standards.

The contract owner (i.e. the address that has deployed the contract) can therefore pause any of them. 
When paused, all methods that cause changes in the Market Admins,Store Owner, stores, products or, most importantly, balances, cannot be used. 

The pausable functions have the `whenNotPaused` modifier. 


## Restricting Access
Zeppelin's `AccessControl` library is extended to the `Administered.sol` contract. 
`Administered` contract is extended to the `Marketplace.sol` contract. 

`Marketplace.sol` contract will check user role and restrict functions based on that.

A role in AccessControl.sol is a struct that contains a set of addresses, representing the accounts bearing that role. All roles are stored in a mapping indexed by a bytes32 identifier, unique for each role.
Each role also contains the bytes32 identifier of another role, which we call its admin role.


## Use a library (SafeMath.sol, etc) or extend another contract

Zeppelin's `SafeMath` library is extended to the `Marketplace.sol` contract. 

Wrappers over Solidity’s arithmetic operations with added overflow checks.

Arithmetic operations in Solidity wrap on overflow. This can easily result in bugs, because programmers usually assume that an overflow raises an error, which is the standard behavior in high level programming languages. SafeMath restores this intuition by reverting the transaction when an operation overflows.

Using this library instead of the unchecked operations eliminates an entire class of bugs, so it’s recommended to use it always.

## Reentrancy Guard
Zeppelin's `ReentrancyGuard` library is extended to the `Marketplace.sol` contract. 

Contract module that helps prevent reentrant calls to a function.

Inheriting from ReentrancyGuard will make the nonReentrant modifier available, which can be applied to functions to make sure there are no nested (reentrant) calls to them.

The ReentrancyGuard functions have the `nonReentrant` modifier. 

## withdrawal pattern
`withdrawStoreBalance` function in `Marketplace.sol` contract.
A `Store Owner` can use the `withdrawStoreBalance` function to withdraw the total balance of a  store.
In withdrawal pattern, we'll reset the pending amount before each transfer. It will ensure that only caller contract fails.


