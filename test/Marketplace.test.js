const { expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const makeInterfaceId = require('@openzeppelin/test-helpers/src/makeInterfaceId');
let catchRevert = require("./exceptionsHelpers.js").catchRevert

const { expect } = require('chai');

// Needed for getBalance 
const promisify = (inner) =>
  new Promise((resolve, reject) =>
    inner((err, res) => {
      if (err) { reject(err) }
      resolve(res);
    })
  );


// Get an account's balance 
const getBalance = (account, at) =>
  promisify(cb => web3.eth.getBalance(account, at, cb));
let receipt;
let receipt2;

const Marketplace = artifacts.require("./Marketplace.sol")

contract('Marketplace', function (accounts) {
  const [ owner, marketAdmin, storeOwner, shopper, other, otherMarketAdmin,otherStoreOwner ] = accounts;

  const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000';
  const MARKET_ADMIN_ROLE = web3.utils.soliditySha3('MARKET_ADMIN_ROLE');
  const STORE_OWNER = web3.utils.soliditySha3('STORE_OWNER');
  let marketplace;
  const price = "1000"
  const name = "book"

  beforeEach(async function () {
    marketplace = await Marketplace.new({ from: owner });
  });

   /**
     * @test {Marketplace#addStore}
     */
    it('addStore throws if not called by an storOwner account.', async () => {
      await catchRevert(
        marketplace.addStore("Store Name", { from: shopper }),
          'Restricted to storOwner.',
      );
  });


  ///@test {Marketplace#addProduct}

  it('addProduct throws if not called by an storeOwner account.', async () => {
    await marketplace.addMarketAdmin(marketAdmin, { from: owner });
    await marketplace.addStoreOwner(storeOwner, { from: marketAdmin });
    await marketplace.addStore("Store Name", { from: storeOwner });
    await catchRevert(
        marketplace.addProduct(name,price,0, { from: other }),
          'Restricted to storeOwner.',
      );
   

  });


describe('with existing Store', () => {
  beforeEach(async () => {
      await marketplace.addMarketAdmin(marketAdmin, { from: owner });
      await marketplace.addStoreOwner(storeOwner, { from: marketAdmin });
      receipt=await marketplace.addStore("StoreName0", { from: storeOwner });
  });

  ///@test {Marketplace#LogStoreAdded}
  it('emit LogStoreAdded event.', async () => {
    if (receipt.logs[0].event == "LogStoreAdded") {
      eventEmitted = true
    }
    assert.equal(eventEmitted, true, 'adding an Store should emit LogStoreAdded event')
  });

     ///@test {Marketplace#getStore}
    it('addStore adds an store.', async () => {
      const result=await marketplace.getStore(0)
      let countResult=await marketplace.getStoreCount()
        assert.equal(result[1], "StoreName0", 'the name of the last added Store does not match the expected value')
        assert.equal(result[2], storeOwner, 'the owner of the last added item does not match the expected value')
        assert.equal(result[3], 0, 'the balance of the item should be "0"')
        assert.equal(countResult.toString(), "1", 'the cout of the item should be "1"')
    });

    it('add second store.', async () => {
      receipt=await marketplace.addStore("StoreName2", { from: storeOwner });
      const result=await marketplace.getStore(1)
      let countResult=await marketplace.getStoreCount()
      //console.log(result)
      assert.equal(result[1], "StoreName2", 'the name of the last added Store does not match the expected value')
      assert.equal(result[2], storeOwner, 'the owner of the last added item does not match the expected value')
      assert.equal(result[3], 0, 'the balance of the item should be "0"')
      assert.equal(countResult.toString(), "2", 'the cout of the item should be "2"')
    });

});

describe('with existing Products', () => {
  beforeEach(async () => {
      await marketplace.addMarketAdmin(marketAdmin, { from: owner });
      await marketplace.addStoreOwner(storeOwner, { from: marketAdmin });
      await marketplace.addStore("StoreName3", { from: storeOwner });
      receipt=await marketplace.addProduct("ProductName0", price, 1, { from: storeOwner });

      
  });
  ///@test {Marketplace#LogStoreAdded}
  it('emit LogStoreAdded event.', async () => {
    if (receipt.logs[0].event == "LogProductAdded") {
      eventEmittedLogProductAdded = true
    }
    if (receipt.logs[1].event == "LogForSale") {
      eventEmittedLogForSale = true
    }
    assert.equal(eventEmittedLogProductAdded, true, 'adding an Product should emit LogProductAdded event')
    assert.equal(eventEmittedLogForSale, true, 'adding an Product should emit LogForSale event')
  });

  it('addProduct adds a Product.', async () => {
    const result=await marketplace.getProduct(0)
    let countResult=await marketplace.getProductCount()
      assert.equal(result[1], "ProductName0", 'the name of the last added Product does not match the expected value')
      assert.equal(result[2], price, 'the price of the last added item does not match the expected value')
      assert.equal(result[3], 1, 'the store id of the item should be "0"')
      assert.equal(countResult.toString(), "1", 'the cout of the item should be "1"')
  });

  it('add second Product.', async () => {
    receipt=await marketplace.addProduct("ProductName2", 1000, 0, { from: storeOwner });
    const result=await marketplace.getProduct(1)
    let countResult=await marketplace.getProductCount()
    //console.log(result)
    assert.equal(result[1], "ProductName2", 'the name of the last added Product does not match the expected value')
      assert.equal(result[2], 1000, 'the price of the last added item does not match the expected value')
      assert.equal(result[3], 0, 'the store id of the item should be "0"')
      assert.equal(countResult.toString(), "2", 'the cout of the item should be "2"')
  });

  it('Purchase a product.', async () => {

	
    let initialBalance = await getBalance(shopper);
    receipt=await marketplace.purchaseProduct(0, { from: shopper , value: price});

		let finalBalance = await getBalance(shopper);
		let gasUsed = receipt.receipt.gasUsed;
		let tx = await web3.eth.getTransaction(receipt.tx);
		let gasPrice = tx.gasPrice;
		let gasCost = gasUsed * gasPrice;

    
	//let balance = await marketplace.getStorefrontBalance(storefrontId);
		//assert.equal(balance, productPrice);

		let contractBalance = await marketplace.getBalance();
		assert.equal(contractBalance, price);


    if (receipt.logs[0].event == "LogSold") {
      eventEmittedLogSold = true
    }

    assert.equal(eventEmittedLogSold, true, 'Purchasing a product.should emit LogSold event')
    assert.equal(Number(initialBalance)-price-gasCost, Number(finalBalance));  
  });

  it('withdraw from store.', async () => {

    receipt=await marketplace.purchaseProduct(0, { from: shopper , value: price});

    let initialBalance = await getBalance(storeOwner);
    receipt2=await marketplace.withdrawStoreBalance(1, { from: storeOwner});
		let finalBalance = await getBalance(storeOwner);
		let gasUsed = receipt2.receipt.gasUsed;
		let tx = await web3.eth.getTransaction(receipt2.tx);
		let gasPrice = tx.gasPrice;
		let gasCost = gasUsed * gasPrice;

   
    if (receipt.logs[0].event == "LogSold") {
      eventEmittedLogSold = true
    }

    
    if (receipt2.logs[0].event == "LogWithdrawStoreBalance") {
      eventLogWithdrawStoreBalance = true
    }


    assert.equal(eventEmittedLogSold, true, 'Purchasing a product.should emit LogSold event')
    assert.equal(eventLogWithdrawStoreBalance, true, 'withdrawing from Store.should emit LogWithdrawStoreBalance event')
    assert.equal(Number(initialBalance) + Number(price) - Number(gasCost), Number(finalBalance));
  
  
  });

});

});