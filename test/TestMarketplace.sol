pragma solidity ^0.6.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Marketplace.sol";
import "../contracts/UserProxy.sol";

contract TestMarketplace {

    // Test for failing conditions in this contracts:
    // https://truffleframework.com/tutorials/testing-for-throws-in-solidity-tests

    UserProxy buyer;
    UserProxy seller;
    Marketplace marketplace;
    uint public initialBalance = 1000;

    function beforeEach() public {
        //supplychain = SupplyChain(DeployedAddresses.SupplyChain());
        marketplace = new Marketplace();
        buyer = new UserProxy(address(marketplace));
        address(buyer).transfer(10);
        seller = new UserProxy(address(marketplace));
        address(seller).transfer(10);

    }
/*
        // buyItem
    // test for failure if user does not send enough funds
    function testUserDoesNotSendEnoughFunds() public {
        seller.addProduct("Book", 5,0);
        Assert.isFalse(buyer.purchaseProduct(0, 10), "user does not send enough funds");
    }
    */
}