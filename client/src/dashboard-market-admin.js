import React, { Component } from 'react';

class MarketAdminDashboard extends Component {

  render() {
    return (
        <div id="dashboard-admin">
          <h1>Market Admin Dashboard</h1>
          <h2>Manage Store Owners</h2>
          <form onSubmit={(event) => {
            event.preventDefault()
            const address = this.userAddress.value
            this.props.addStoreOwner(address)
            }}>
            <div className="form-group mr-sm-2">
            <input
              id="userAddress"
              type="text"
              ref={(input) => { this.userAddress = input }}
              className="form-control"
              placeholder="User Address"
              required />
            </div>
            <button type="submit" className="btn btn-primary">Add Store Owner</button>
          </form>

          <p>&nbsp;</p>
        <h2>Store Owner List</h2>
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

export default MarketAdminDashboard;