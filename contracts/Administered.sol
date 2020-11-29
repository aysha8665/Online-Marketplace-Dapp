pragma solidity >=0.5.16 <0.8.0;
import "@openzeppelin/contracts/access/AccessControl.sol";
contract Administered is AccessControl{

  bytes32 public constant MARKET_ADMIN_ROLE = keccak256("MARKET_ADMIN_ROLE");
  bytes32 public constant STORE_OWNER_ROLE = keccak256("STORE_OWNER");

  /// @dev Add `root` to the admin role as a member.
  constructor ()
    public
  {
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    //_setupRole(MARKET_ADMIN_ROLE, msg.sender);
    _setRoleAdmin(MARKET_ADMIN_ROLE, DEFAULT_ADMIN_ROLE);
    _setRoleAdmin(STORE_OWNER_ROLE, MARKET_ADMIN_ROLE);
  }
  
  /// @dev Restricted to members of the admin role.
  modifier onlyAdmin()
  {
    require(isAdmin(msg.sender), "Restricted to admins.");
    _;
  }

    /// @dev Restricted to members of the MarketAdmin role.
  modifier onlyMarketAdmin()
  {
    require(isMarketAdmin(msg.sender), "Restricted to MarketAdmin.");
    _;
  }

  /// @dev Restricted to members of the StoreOwner role.
  modifier onlyStoreOwner()
  {
    require(isStoreOwner(msg.sender), "Restricted to StoreOwner.");
    _;
  }

  /// @dev Return `true` if the account belongs to the admin role.
  /// @param account address of account to check is admin.
  function isAdmin(address account) 
    public virtual view returns (bool)
  {
    return hasRole(DEFAULT_ADMIN_ROLE, account);
  }

  /// @dev Return `true` if the account belongs to the MarketAdmin role.
  /// @param account address of account to check is MarketAdmin.
  function isMarketAdmin(address account)
    public virtual view returns (bool)
  {
    return hasRole(MARKET_ADMIN_ROLE, account);
  }

  /// @dev Return `true` if the account belongs to the StoreOwner role.
  /// @param account address of account to check is StoreOwner.
  function isStoreOwner(address account)
    public virtual view returns (bool)
  {
    return hasRole(STORE_OWNER_ROLE, account);
  }

 
  /// @dev Add an account to the admin role. Restricted to admins.
  /// @param account address of account to Add as Admin.
  function addAdmin(address account)
    public virtual onlyAdmin
  {
    grantRole(DEFAULT_ADMIN_ROLE, account);
  }

  /// @dev Add an account to the admin role. Restricted to admins.
  /// @param account address of account to to Add as MarketAdmin.
  function addMarketAdmin(address account)
    public virtual onlyAdmin
  {
    grantRole(MARKET_ADMIN_ROLE, account);
  }

   /// @dev Add an account to the user role. Restricted to MarketAdmins.
   /// @param account address of account to Add as StoreOwner.
  function addStoreOwner(address account)
    public virtual onlyMarketAdmin
  {
    grantRole(STORE_OWNER_ROLE, account);
  }

  
  /// @dev Remove oneself from the admin role.
  function renounceAdmin()
    public virtual
  {
    renounceRole(DEFAULT_ADMIN_ROLE, msg.sender);
  }

  /// @dev Remove an account from the MarketAdmin role. Restricted to admins.
  /// @param account address of account to Remove.
  function removeMarketAdmin(address account)
    public virtual onlyAdmin
  {
    revokeRole(MARKET_ADMIN_ROLE, account);
  }

  /// @dev Remove an account from the StoreOwner role. Restricted to MarketAdmins.
  /// @param account address of account to Remove.
  function removeStoreOwner(address account)
    public virtual onlyMarketAdmin
  {
    revokeRole(STORE_OWNER_ROLE, account);
  }

  /// @dev get MarketAdminsCount. Restricted to Admins.
  /// @return MarketAdmins Count.
  function getMarketAdminsCount()
  public virtual view 
  onlyAdmin
  returns (uint)
  {
    return getRoleMemberCount(MARKET_ADMIN_ROLE);
  }

  /// @dev get MarketAdminsCount. Restricted to MarketAdmins.
  /// @return StoreOwners Count.
  function getStoreOwnersCount()
  public virtual view
  onlyMarketAdmin 
  returns (uint)
  {
    return getRoleMemberCount(STORE_OWNER_ROLE);
  }

  /// @dev get MarketAdminMember. Restricted to Admins.
  /// @return MarketAdmin Member.
  function getMarketAdminMember(uint256 index)
  public virtual view
  onlyAdmin
  returns (address)
  {
    return getRoleMember(MARKET_ADMIN_ROLE,index);
  }

  /// @dev get StoreOwnerMember. Restricted to MarketAdmins.
  /// @return StoreOwners Member.
  function getStoreOwnerMember(uint256 index)
  public virtual view
  onlyMarketAdmin 
  returns (address)
  {
    return getRoleMember(STORE_OWNER_ROLE,index);
  }
}