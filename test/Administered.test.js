const { expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
let catchRevert = require("./exceptionsHelpers.js").catchRevert

const { expect } = require('chai');

//const AccessControlMock = artifacts.require('AccessControlMock');
const Administered = artifacts.require("./Administered.sol")

contract('Administered', function (accounts) {
  const [ owner, marketAdmin, storeOwner, shopper, other, otherMarketAdmin,otherStoreOwner ] = accounts;

  const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000';
  const MARKET_ADMIN_ROLE = web3.utils.soliditySha3('MARKET_ADMIN_ROLE');
  const STORE_OWNER = web3.utils.soliditySha3('STORE_OWNER');
  let administered;

  beforeEach(async function () {
    administered = await Administered.new({ from: owner });
  });

  /**
     * @test {Administered#isAdmin}
     */
    it('isAdmin returns true for admins', async () => {
      assert.isTrue(await administered.isAdmin(owner));
      assert.isFalse(await administered.isAdmin(other));
  });

  /**
     * @test {Administered#isMarketAdmin}
     */
    it('isMarketAdmin returns false for non existing MarketAdmin', async () => {
      assert.isFalse(await administered.isMarketAdmin(storeOwner));
  });

    /**
     * @test {Administered#isStoreOwner}
     */
    it('isStoreOwner returns false for non existing StoreOwner', async () => {
      assert.isFalse(await administered.isStoreOwner(other));
  });

   /**
     * @test {Administered#addMarketAdmin}
     */
    it('addMarketAdmin throws if not called by an admin account.', async () => {
      await catchRevert(
          administered.addMarketAdmin(other, { from: shopper }),
          'Restricted to admin.',
      );
  });

  /**
   * @test {Administered#addStoreOwner}
   */
  it('addStoreOwner throws if not called by an marketAdmins account.', async () => {
      await catchRevert(
          administered.addStoreOwner(shopper, { from: other }),
          'Restricted to marketAdmins.',
      );
  });

   /**
     * @test {Administered#addMarketAdmin} and {Administered#isUser}
     */
  it('addMarketAdmin adds an account as an MarketAdmin.', async () => {
      await administered.addMarketAdmin(marketAdmin, { from: owner });
      assert.isTrue(await administered.isMarketAdmin(marketAdmin));
  });

  it('addStoreOwner adds an account as an StoreOwner.', async () => {
    await administered.addMarketAdmin(marketAdmin, { from: owner });
    await administered.addStoreOwner(storeOwner, { from: marketAdmin });
    assert.isTrue(await administered.isStoreOwner(storeOwner));
});

describe('with existing MarketAdmin', () => {
  beforeEach(async () => {
      await administered.addMarketAdmin(marketAdmin, { from: owner });
  });

  /**
   * @test {Administered#removeMarketAdmin}
   */
  it('removeMarketAdmin removes an MarketAdmin.', async () => {
      await administered.removeMarketAdmin(marketAdmin, { from: owner });
      assert.isFalse(await administered.isMarketAdmin(marketAdmin));
  });
});

describe('with existing StoreOwner', () => {
  beforeEach(async () => {
      await administered.addMarketAdmin(marketAdmin, { from: owner });
      await administered.addStoreOwner(storeOwner, { from: marketAdmin });
  });

  /**
   * @test {Administered#removeStoreOwner}
   */
  it('removeStoreOwner removes an StoreOwner.', async () => {
      await administered.removeStoreOwner(storeOwner, { from: marketAdmin });
      assert.isFalse(await administered.isStoreOwner(storeOwner));
  });
});

});