import React, { Component } from 'react';

class StoreOwnerDashboard extends Component {

  render() {
    return (
        <div id="store-owner">
          <h1>Store Owner Dashboard</h1>
          <h2>Manage Stores and Products</h2>
          <form onSubmit={(event) => {
            event.preventDefault()
            const storeName = this.storeName.value
            this.props.addStore(address)
            }}>
            <div className="form-group mr-sm-2">
            <input
              id="storeName"
              type="text"
              ref={(input) => { this.userAddress = input }}
              className="form-control"
              placeholder="Store Name"
              required />
            </div>
            <button type="submit" className="btn btn-primary">Add Store Owner</button>
          </form>

          <p>&nbsp;</p>
        <h2>Remove Store Owners</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Store Owner Address</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="marketAdminsList">
            
            { 
              this.props.storeOwners.map(storeOwner => {
              return(
                <tr key={storeOwner}>
                  <td>{storeOwner}</td>
                  <td>
                    { 
                      <button
                      address={storeOwner}
                          onClick={(event) => {
                            this.props.removeStoreOwner(storeOwner)
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
        </table>


        </div>
        );
  }
}

export default StoreOwnerDashboard;