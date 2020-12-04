const { expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const makeInterfaceId = require('@openzeppelin/test-helpers/src/makeInterfaceId');
let catchRevert = require("./exceptionsHelpers.js").catchRevert

const { expect } = require('chai');
let tx;

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
      tx=await marketplace.addStore("StoreName", { from: storeOwner });
  });

  ///@test {Marketplace#LogStoreAdded}
  it('emit LogStoreAdded event.', async () => {
    if (tx.logs[0].event == "LogStoreAdded") {
      eventEmitted = true
    }

    assert.equal(eventEmitted, true, 'adding an Store should emit LogStoreAdded event')
  });

     ///@test {Marketplace#getStore}

    it('addStore adds an store.', async () => {
      const result=await marketplace.getStore(0)
        assert.equal(result[1], "StoreName", 'the name of the last added Store does not match the expected value')
        assert.equal(result[2], storeOwner, 'the owner of the last added item does not match the expected value')
        assert.equal(result[3], 0, 'the balance of the item should be "0"')
    });
    it('get Store Count.', async () => {
      const result=await marketplace.getStoreCount()
        //assert.equal(result[1], "StoreName", 'the name of the last added Store does not match the expected value')
        console.log(result.toString())
    });
    it('add second store.', async () => {
      tx=await marketplace.addStore("StoreName2", { from: storeOwner });
      const result=await marketplace.getStore(1)
        assert.equal(result[1], "StoreName2", 'the name of the last added Store does not match the expected value')
        assert.equal(result[2], storeOwner, 'the owner of the last added item does not match the expected value')
        assert.equal(result[3], 0, 'the balance of the item should be "0"')
    });
    it('get Store Count.', async () => {
      let result=await marketplace.getStoreCount()
        //assert.equal(result[1], "StoreName", 'the name of the last added Store does not match the expected value')
        console.log(result.toString())
    });
});

});