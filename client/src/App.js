import React, { Component } from "react";
import AdministeredContract from "./contracts/Administered.json";
import MarketplaceContract from "./contracts/Marketplace.json";
import getWeb3 from "./getWeb3";

import "./App.css";
import AdminDashboard from './dashboard-admin'
import MarketAdminDashboard from './dashboard-market-admin'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      web3: null, 
      userRole:'user',
      accounts: null, 
      administeredContract: null,
      marketAdmins:[],
      storeOwners:[],
      loading:true,
     }
     this.addMarketAdmin = this.addMarketAdmin.bind(this)
     this.removeMarketAdmin = this.removeMarketAdmin.bind(this)
     this.addStoreOwner = this.addStoreOwner.bind(this)
     this.removeStoreOwner = this.removeStoreOwner.bind(this)
  }
 

  
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = AdministeredContract.networks[networkId];
      const administeredContractInstance = new web3.eth.Contract(
        AdministeredContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, userRole:'user', accounts, 
      administeredContract: administeredContractInstance,
      marketAdmins:[],
      loading:true}, this.checkUserRole);
      
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        'Failed to load web3, accounts, or contract. Check console for details.',
      );
      console.error(error);
    }
  };

  checkUserRole = async () => {
    //const { accounts, administeredContract } = this.state;

    // Stores a given value, 5 by default.
    //await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const isAdminTemp = await this.state.administeredContract.methods.isAdmin(this.state.accounts[0]).call();
    const isMarketAdminTemp = await this.state.administeredContract.methods.isMarketAdmin(this.state.accounts[0]).call();
    const isStoreOwnerTemp = await this.state.administeredContract.methods.isStoreOwner(this.state.accounts[0]).call();
    if(isAdminTemp)
    {
      this.setState({userRole:'admin'}, this.loadMarketAdmins);
      this.setState({ loading: false});
    }
    else if(isMarketAdminTemp)
    {
      this.setState({userRole:'marketAdmin'}, this.loadStoreOwner);
      this.setState({ loading: false});
    }
    else if(isStoreOwnerTemp)
    {
      this.setState({userRole:'storeOwner'});
      this.setState({ loading: false});
    }
    else
    {
      this.setState({ loading: false});
    }
    console.log(this.state.userRole);
    

    // Update state with the result.
    //this.setState({ storageValue: response });
  };
  renderDashboard(){
    //switch() {
      if(this.state.userRole==='admin')
        return <AdminDashboard 
        marketAdmins={this.state.marketAdmins}
        addMarketAdmin={this.addMarketAdmin}
        removeMarketAdmin={this.removeMarketAdmin}
        />
      if(this.state.userRole==='marketAdmin')
        return <MarketAdminDashboard 
        storeOwners={this.state.storeOwners}
        addStoreOwner={this.addStoreOwner}
        removeStoreOwner={this.removeStoreOwner}
        />
        if(this.state.userRole==='storeOwner')
          return <h2>Store Owner</h2>;
      
        //return <h2>User</h2>;
    
  };

  addMarketAdmin(accountAdddress){
    this.setState({loading:true});
    this.state.administeredContract.methods.addMarketAdmin(accountAdddress).send({from:this.state.accounts[0]})
    .once('receipt', (receipt) => {
      
      this.setState({ loading: false })
    })

  };

  removeMarketAdmin(accountAdddress){
    this.setState({loading:true});
    this.state.administeredContract.methods.removeMarketAdmin(accountAdddress).send({from:this.state.accounts[0]})
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })

  };

  addStoreOwner(accountAdddress){
    this.setState({loading:true});
    this.state.administeredContract.methods.addStoreOwner(accountAdddress).send({from:this.state.accounts[0]})
    .once('receipt', (receipt) => {
      
      this.setState({ loading: false })
    })

  };

  removeStoreOwner(accountAdddress){
    this.setState({loading:true});
    this.state.administeredContract.methods.removeStoreOwner(accountAdddress).send({from:this.state.accounts[0]})
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })

  };

  addStore(name){
    this.setState({loading:true});
    this.state.administeredContract.methods.addStore(name).send({from:this.state.accounts[0]})
    .once('receipt', (receipt) => {
      
      this.setState({ loading: false })
    })

  };

  removeStore(storeId){
    this.setState({loading:true});
    this.state.administeredContract.methods.removeStore(storeId).send({from:this.state.accounts[0]})
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })

  };

  async loadMarketAdmins()
  {
    this.setState({loading:true});
    const marketAdminsCount = await this.state.administeredContract.methods.getMarketAdminsCount().call();
      //this.setState({ marketAdminsCount })
      // Load products
      console.log(marketAdminsCount);
      for (var i = 0; i < marketAdminsCount; i++) {
        const marketAdminAddress = await this.state.administeredContract.methods.getMarketAdminMember(i).call()
        this.setState({
          marketAdmins: [...this.state.marketAdmins, marketAdminAddress]
        })
      }
      console.log(this.state.marketAdmins)
      this.setState({ loading: false})
  };

  async loadStoreOwner()
  {
    this.setState({loading:true});
    const storeOwnersCount = await this.state.administeredContract.methods.getStoreOwnersCount().call();
      //this.setState({ marketAdminsCount })
      // Load products
      console.log(storeOwnersCount);
      for (var i = 0; i < storeOwnersCount; i++) {
        const storeOwnerAddress = await this.state.administeredContract.methods.getStoreOwnerMember(i).call()
        this.setState({
          storeOwners: [...this.state.storeOwners, storeOwnerAddress]
        })
      }
      console.log(this.state.storeOwners)
      this.setState({ loading: false})
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        {
            
            this.state.loading
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                : this.renderDashboard()
        }
      </div>
    );
  }
}

export default App;
