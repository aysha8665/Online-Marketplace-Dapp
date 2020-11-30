pragma solidity >=0.5.16<0.8.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./Administered.sol";
import "./Store.sol";

/// @title A simulator for Market Place
/// @author Aysha Amin
/// @notice You can use this contract for only the most basic simulation
contract Marketplace is Administered, Pausable, ReentrancyGuard{

using SafeMath for uint256;
  struct Store{
		uint256 id; 
		string name;
		address owner; 
		uint256 balance; 
	}
  struct Product{
    uint256 id;
    string name;
    uint256 price;
    uint storeId; 
    State state;
    address payable seller;
    address payable buyer;
  }
  enum State{
    ForSale,
    Sold
  }

	mapping (uint256 => Store) private stores; 
  mapping (uint256 => Product) public products;
  uint256 productCount;
  uint256 storeCount;


  constructor() public 
  {
    /* Here, set the owner as the person who instantiated the contract
       and set your idCount to 0. */
       //owner=msg.sender;
       _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    //_setupRole(MARKET_ADMIN_ROLE, msg.sender);
    _setRoleAdmin(MARKET_ADMIN_ROLE, DEFAULT_ADMIN_ROLE);
    _setRoleAdmin(STORE_OWNER_ROLE, MARKET_ADMIN_ROLE);
       productCount=0;
       storeCount=0;
  }

  event LogForSale(uint256 id);
  event LogSold(uint256 id);
  event LogStoreAdded (
		uint256 id, 
		string name, 
		address owner, 
		uint256 balance);

  event LogProductAdded (
		uint256 id, 
		string name, 
		uint256 price, 
		uint256 storeId);
  event LogWithdrawStoreBalance(
    uint256 storeId,
		uint256 amount
  );
  event LogPriceUpdated(
    uint256 id, 
		uint256 oldPrice, 
		uint256 newPrice
  );
  event ProductRemoved(uint256 _productId);
  event ProductsRemoved(uint256 _storeId);
  event StoreRemoved(uint256 _storeId);


  modifier forSale(uint256 _productId){require(products[_productId].state == State.ForSale && products[_productId].price >= 0); _;}
  modifier sold(uint256 _productId){require(products[_productId].state == State.Sold && products[_productId].buyer != address(0)); _;}
  modifier paidEnough(uint256 _price) { require(msg.value >= _price); _;}
  modifier checkValue(uint256 _productId) {
    //refund them after pay for item (why it is before, _ checks for logic before func)
    _;
    uint256 _price = products[_productId].price;
    uint256 amountToRefund = msg.value.sub(_price) ;
    products[_productId].buyer.transfer(amountToRefund);
  }
  
  modifier onlyOwnerOfThisStore(uint256 _storeId)
  {
    require(stores[_storeId].owner == msg.sender, "Restricted to StoreOwner.");
    _;
  }

  /// @dev Add a Store.
	/// @param _name Name of Store to Add 
  /// @return Store Added
  function addStore(string memory _name)
  onlyStoreOwner
  whenNotPaused
  public
  returns(bool)
  {
    stores[storeCount] = Store({ id: storeCount,name: _name, owner: msg.sender, balance: 0});
    emit LogStoreAdded(storeCount, _name, msg.sender, 0);
    storeCount.add(1);
    return true;
  }
  
  /// @dev Get Store Count.
  /// @return The count of the stores
  function getStoreCount() 
  public 
  view 
  returns (uint256) {
    return storeCount.sub(1);
  } 

  /// @dev Get a Store.
	/// @param _storeId ID of Store to Get 
  function getStore(uint256 _storeId) 
  public 
  view 
  returns (uint256 id,string memory name, address owner, uint256 balance) {
    name = stores[_storeId].name;
    owner = stores[_storeId].owner;
    balance = stores[_storeId].balance;
    return (_storeId,name, owner, balance);
  } 

  /// @dev Remove a Store.
	/// @param _storeId ID of Store to Remove 
  function removeStore(uint256 _storeId)
  onlyStoreOwner
  whenNotPaused
  public
  {
    removeStoreProducts(_storeId);
    delete stores[_storeId];
		emit StoreRemoved(_storeId);
  }

  /// @dev Add a product.
	/// @param _name Name of product to Add 
  /// @param _price Price ID for product 
  /// @param _storeId Store ID for product to Add 
  function addProduct(string memory _name,uint256 _price,uint256  _storeId)
    onlyStoreOwner
    whenNotPaused
    public
    returns(bool)
  {
    products[productCount] = Product({name: _name, id: productCount, price: _price, storeId:_storeId ,state: State.ForSale, seller: msg.sender, buyer: address(0)});
    emit LogProductAdded(productCount, _name,_price, _storeId);
    emit LogForSale(productCount);
    productCount = productCount.add(1);
    return true;
  }

  /// @dev Get a product.
	/// @param _productId ID of product to Get 
  function getProduct(uint256 _productId)
	view 
	public
	returns (string memory, uint256, uint256) {

		return ( products[_productId].name,
				products[_productId].price,
				products[_productId].storeId
        );
	}

  /// @dev update a product.
  /// @param _productId ID of product to Update 
  /// @param _price New Price ID for product 
  /// @param _storeId Store ID for product to Update 
  function updateProduct(uint256 _productId, uint256 _price, uint256 _storeId) 
  onlyStoreOwner
  onlyOwnerOfThisStore(_storeId)
  whenNotPaused
  public {
    uint256 oldPrice=products[_productId].price;
		products[_productId].price=_price;
		emit LogPriceUpdated(_productId, oldPrice, _price);
  }

  /// @dev Removes a product.
	/// @param _storeId Store ID for product to remove 
	/// @param _productId ID of product to remove 
  function removeProduct(uint256 _productId,uint256 _storeId)
  onlyStoreOwner
  onlyOwnerOfThisStore(_storeId)
  whenNotPaused
  public
  {
		delete products[_productId];
		emit ProductRemoved(_productId);
  }

  /// @dev Removes products from store.
	/// @param _storeId Storefront ID for products to remove 
  function removeStoreProducts(uint256 _storeId)
  onlyStoreOwner
  onlyOwnerOfThisStore(_storeId)
  whenNotPaused
  public
  {
		for(uint i=0; i<productCount; i.add(1)) {
			if ( products[i].storeId == _storeId) {
				delete products[i];
				emit ProductRemoved(products[i].id);
			}
		}
    emit ProductsRemoved(_storeId);
  }

  /// @dev Purchase a product.
  /// @param _productId ID of product to Purchase 
  /// @return The Product Purchased
  function purchaseProduct(uint256 _productId)
  payable
  forSale(_productId) 
  paidEnough(products[_productId].price) 
  checkValue(_productId)
  whenNotPaused
  nonReentrant
  public
  returns (bool)
  {
    products[_productId].buyer = msg.sender;
    products[_productId].state = State.Sold;
    stores[products[_productId].storeId].balance.add(msg.value);
    emit LogSold(_productId);
    return true;
  }

  /// @dev Withdraw The Store Balance.
  /// @param _storeId ID of Store to Withdraw 
  /// @return The Withdraw Done
  function withdrawStoreBalance(uint256 _storeId) 
  payable
	onlyStoreOwner
  onlyOwnerOfThisStore(_storeId)
	whenNotPaused
  nonReentrant
	public 
  returns (bool)
  {
		require(stores[_storeId].balance > 0);
		uint storeBalance = stores[_storeId].balance;
    stores[_storeId].balance = 0;
		msg.sender.transfer(storeBalance);
		emit LogWithdrawStoreBalance(_storeId, storeBalance);
		return true;
	}

}