import React, { Component } from 'react';

class StoreOwnerDashboard extends Component {

  render() {
    return (
        <div id="store-owner">

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

          <p>&nbsp;</p>
        <h2>Remove Stores</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Store List</th>
              <th scope="col"></th>
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
                      storeId={store.id}
                          onClick={(event) => {
                            this.props.withdrawStore(store.id)
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
                      storeId={store.id}
                          onClick={(event) => {
                            this.props.removeStore(store.id)
                          }}
                        >
                          Remove
                        </button>
                    }
                    </td>
                    <td>
                      <h2>Manage Products</h2>
                      <h2>Add a Products</h2>
          <form onSubmit={(event) => {
            event.preventDefault()
            const productName = this.productName.value
            const productPrice = this.productPrice.value
            this.props.addProduct(productName,productPrice,store.id)
            }}>
            <div className="form-group mr-sm-2">
            <input
              id="productName"
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
              placeholder="Store Price"
              required />

            </div>
            <button type="submit" className="btn btn-primary">Add Store</button>
          </form>

          <p>&nbsp;</p>
        <h2>Remove Products</h2>
                    <tbody id="productList">
                    { 
                    this.props.products.map(product => {
                      return(
                        <tr key={product}>
                        <td>{product}</td>
                        <td>
                          { 
                            <button
                            address={product}
                                onClick={(event) => {
                                  this.props.removeProduct(product)
                                }}
                              >
                                Remove
                              </button>
                            
                          }
                          </td>
                          </tr>
                      )
            
                  })
              
                    }
                    </tbody>
                    </td>
                </tr>

              )
            })
          }
          </tbody>
        </table>


        </div>
        );
  }
}

export default StoreOwnerDashboard;