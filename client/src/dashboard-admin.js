import React, { Component } from 'react';

class AdminDashboard extends Component {

  render() {
    return (
        <div id="dashboard-admin">
          <h1>Admin Dashboard (Owner)</h1>
          <h2>Manage Admins</h2>
          <form onSubmit={(event) => {
            event.preventDefault()
            const address = this.userAddress.value
            this.props.addMarketAdmin(address)
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
            <button type="submit" className="btn btn-primary">Add Market Admin</button>
          </form>

          <p>&nbsp;</p>
        <h2>Market Admin List</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Market Admin Address</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="marketAdminsList">
            
            { 
              this.props.marketAdmins.map(marketAdmin => {
              return(
                <tr key={marketAdmin}>
                  <td>{marketAdmin}</td>
                  <td>
                    { 
                      <button
                      address={marketAdmin}
                          onClick={(event) => {
                            this.props.removeMarketAdmin(marketAdmin)
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

export default AdminDashboard;