pragma solidity >=0.5.16<0.8.0;

import "./Marketplace.sol";

contract UserProxy {

    address marketplace;

    constructor(address _Marketplace) public {
        marketplace = _Marketplace;
    }

    function addProduct(string memory _name,uint256 _price,int32  _storeId) public returns(bool) {
        (bool success, ) = address(marketplace).call(abi.encodeWithSignature("addProduct(string,uint256)",_name,_price,_storeId));
        return success;
    }

    function purchaseProduct(int32 _productId,uint256 _offer) public  payable returns(bool){
        (bool success, ) = address(marketplace).call{gas: 1000000, value: _offer}(abi.encodeWithSignature("purchaseProduct(int32)",_productId));
        return success;
    }


    fallback() external payable {}

    receive() external payable {}

}