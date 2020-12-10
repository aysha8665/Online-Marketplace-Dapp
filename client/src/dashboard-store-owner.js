import React, { Component } from 'react';

class StoreOwnerDashboard extends Component {
  state = {
    store: true,
    storeId:0,
    products:[],
    loadingDashboard:false
  };
  showStore = event => {
    this.setState({loadingDashboard:true});
    this.setState({
      store: !this.state.store
    });
    this.setState({loadingDashboard: false })
  };

  async loadProducts()
  {
    this.setState({
      products: []
    })
    this.setState({loadingDashboard:true});
    const product2 = await this.props.marketplaceContract.methods.getProduct(0).call();
    const productsCount=await this.props.marketplaceContract.methods.getProductCount().call();
    console.log("productsCount");
    console.log(productsCount);

      console.log("this.state.storeId");
      console.log(this.state.storeId);
      for (var i = 0; i < productsCount; i++) {
        const product = await this.props.marketplaceContract.methods.getProduct(i).call();
        if(product[3]==this.state.storeId && product[1].toString().length > 0 )
        {
          this.setState({
            products: [...this.state.products, product]
          })
        }
      }
      this.setState({ loadingDashboard: false})
  };

  renderStoreOwnerDashboard(){
  if(this.state.store)
  {
   
    return <div id="store" className="text-center">
      <h1>Store Owner Dashboard</h1>
  <h2>Manage Stores and Products</h2>
  <h2>Add a Store</h2>
  <form onSubmit={(event) => {
    event.preventDefault()
    const storeName = this.storeName.value
    this.props.addStore(storeName)
    }}>
    <div className="form-group mr-sm-2">
    <input
      id="storeName"
      type="text"
      ref={(input) => { this.storeName = input }}
      className="form-control"
      placeholder="Store Name"
      required />
    </div>
    <button type="submit" className="btn btn-primary">Add Store</button>
  </form>


<h2>Stores</h2>
<table className="table">
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Owner</th>
    </tr>
  </thead>
  <tbody id="storeList">
    { 
      this.props.stores.map(store => {
      return(
        <tr key={store.id}>
          <td>{store.name}</td>
          <td>{store.owner}</td>
          <td>{store.balance}</td>
          <td>
            { 
              <button
              name={store.name}
              value={store.id}
                  onClick={(event) => {
                    this.props.withdrawFromStore(event.target.value)
                  }}
                >
                  Withdraw
                </button>
            }
            </td>
            <td></td>
          <td>
            { 

              <button
              name={store.name}
              value={store.id}
                  onClick={(event) => {
                    this.props.removeStore(event.target.value)
                  }}
                >
                  Remove
                </button>
            }
            </td>
            <td>
            { 
              <button
              name={store.name}
              value={store.id}
                  onClick={(event) => {
                    this.setState({ storeId: event.target.value},() => this.loadProducts())
                    this.showStore(event);
                  }}
                >
                  Display Products
                </button>
            }
            </td>
            <td>
            </td>
        </tr>
      )
    })
  }
  </tbody>
</table>  
</div>;
  }
  else{
    return  <div id="product">
<h2>Manage Products</h2>
<h2>Add a Products</h2>
<div >
  <button onClick={(event) => {
                    this.showStore(event);
                  }}>
    close
  </button>
</div>

<form onSubmit={(event) => {
    event.preventDefault()

    const productName = this.productName.value
    const productPrice = this.productPrice.value
    console.log("add product")
  console.log(productName.toString()+"-"+productPrice.toString()+"-"+this.state.storeId)
    this.props.addProduct(productName,productPrice,this.state.storeId)
    }}>
    <div className="form-group mr-sm-2">
    <input
      id={"productName"}
      type="text"
      ref={(input) => { this.productName = input }}
      className="form-control"
      placeholder="Product Name"
      required />
      <input
      id="productPrice"
      type="text"
      ref={(input) => { this.productPrice = input }}
      className="form-control"
      placeholder="Product Price"
      required />

    </div>
    <button type="submit" className="btn btn-primary">Add Product</button>
  </form>
  <h2>Products List</h2>
  <table className="tableProducts">
  <thead>
    <tr>
    <th scope="col">ID</th>
      <th scope="col">Name</th>
      <th scope="col">Price</th>
      <th scope="col">StoreId</th>
    </tr>
  </thead>
  <tbody id="productList">
  { 
            this.state.products.map(product => {
              return(
                <tr key={product[0]}>
                  <td>{product[0]}</td>
                  <td>{product[1]}</td>
                  <td>{product[2]}</td>
                  <td>{product[3]}</td>
                  <td>{ <button
                    name={this.state.storeId}
                    value={product[0]}
                        onClick={(event) => {
                          this.props.removeProduct(event.target.value,event.target.name)
                        }}
                      >
                        Remove
                      </button>
                  }</td>
                  </tr>
              )
          })
            }
    </tbody>
    </table>
     </div>;
  }
}

  render() {
    return (
        <div id="store-owner">

        {
          this.state.loadingDashboard
          ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
          : this.renderStoreOwnerDashboard()
        }
        </div>

        );
}

}

export default StoreOwnerDashboard;