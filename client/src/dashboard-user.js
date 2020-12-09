import React, { Component } from 'react';

class UserDashboard extends Component {
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

    console.log("showStores");

    this.setState({loadingDashboard: false })
  };

  async loadProducts()
  {
    this.setState({
      products: []
    })

    console.log("loadProducts");
    this.setState({loadingDashboard:true});
    const product2 = await this.props.marketplaceContract.methods.getProduct(0).call();
    console.log(product2);
    const productsCount=await this.props.marketplaceContract.methods.getProductCount().call();
    //.then(console.log)
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
      console.log(this.state.products)
      this.setState({ loadingDashboard: false})
  };

  renderUserDashboard(){
  if(this.state.store)
  {
   
    return <div id="store" className="text-center">
      <h1>User Dashboard</h1>



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
<h2>Products</h2>
<div >
  <button onClick={(event) => {
                    this.showStore(event);
                  }}>
    close
  </button>
</div>

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
                          this.props.purchaseProduct(event.target.value)
                        }}
                      >
                        Purchase
                      </button>
                  }</td>
                  </tr>
              )
          })
    }
    </tbody>
    </table>
    </div>
  }
}

  render() {
    return (
        <div id="user-panel">
        {
          this.state.loadingDashboard
          ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
          : this.renderUserDashboard()
        }
        </div>

        );
}

}

export default UserDashboard;