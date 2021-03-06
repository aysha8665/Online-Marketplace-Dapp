import React, { Component } from "react";
import $ from 'jquery';
import MarketplaceContract from "./contracts/Marketplace.json";
import getWeb3 from "./getWeb3";

import "./App.css";
import AdminDashboard from './dashboard-admin'
import MarketAdminDashboard from './dashboard-market-admin'
import StoreOwnerDashboard from './dashboard-store-owner'
import UserDashboard from './dashboard-user'

class App extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      web3: null, 
      userRole:'user',
      accounts: null, 
      marketplaceContract: null,
      marketAdmins:[],
      storeOwners:[],
      stores:[],
      products:[],
      loading:true,
     }
     //this.checkUserRole= this.checkUserRole.bind(this)
     this.addMarketAdmin = this.addMarketAdmin.bind(this)
     this.removeMarketAdmin = this.removeMarketAdmin.bind(this)
     this.addStoreOwner = this.addStoreOwner.bind(this)
     this.removeStoreOwner = this.removeStoreOwner.bind(this)
     this.addStore = this.addStore.bind(this)
     this.removeStore = this.removeStore.bind(this)
     this.addProduct = this.addProduct.bind(this)
     this.removeProduct = this.removeProduct.bind(this)
     this.withdrawFromStore = this.withdrawFromStore.bind(this)
     this.purchaseProduct = this.purchaseProduct.bind(this)
     
  }
 

  
  componentDidMount = async () => {
    //try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetworkMarketplaceContract = MarketplaceContract.networks[networkId];
      const marketplaceContractInstance = new web3.eth.Contract(
        MarketplaceContract.abi,
        deployedNetworkMarketplaceContract && deployedNetworkMarketplaceContract.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, userRole:'user', accounts, 
      administeredContract: marketplaceContractInstance,
      marketplaceContract:marketplaceContractInstance,
      marketAdmins:[],
      loading:true}, this.checkUserRole); 



/*
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        'Failed to load web3, accounts, or contract. Check console for details.',
      );
      console.error(error);
    }*/
  };

  checkUserRole = async () => {
   // try {  
    const isAdminTemp = await this.state.marketplaceContract.methods.isAdmin(this.state.accounts[0]).call();
    const isMarketAdminTemp = await this.state.marketplaceContract.methods.isMarketAdmin(this.state.accounts[0]).call();
    const isStoreOwnerTemp = await this.state.marketplaceContract.methods.isStoreOwner(this.state.accounts[0]).call();
 
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
      this.setState({userRole:'storeOwner'}, this.loadStores);
      this.setState({ loading: false});
    }
    else
    {
      this.setState({userRole:'user'}, this.loadStores);
      this.setState({ loading: false});
    }
  /*} catch (error) {
    // Catch any errors for any of the above operations.
    alert(
      error,
    );
    console.error(error);
  }*/
  };

  renderDashboard(){
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
          return <StoreOwnerDashboard 
          stores={this.state.stores}
          marketplaceContract={this.state.marketplaceContract}
          addStore={this.addStore}
          removeStore={this.removeStore}
          addProduct={this.addProduct}
          removeProduct={this.removeProduct}
          withdrawFromStore={this.withdrawFromStore}
          accountAddress={this.state.accounts[0]}
          />
          if(this.state.userRole==='user')
          return <UserDashboard 
          stores={this.state.stores}
          marketplaceContract={this.state.marketplaceContract}
          addProduct={this.addProduct}
          purchaseProduct={this.purchaseProduct}
          />
  };

  addMarketAdmin(accountAdddress){
    this.setState({loading:true});
     this.state.marketplaceContract.methods.addMarketAdmin(accountAdddress).send({from:this.state.accounts[0]})
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })

  };

  removeMarketAdmin(accountAdddress){
    this.setState({loading:true});
    this.state.marketplaceContract.methods.removeMarketAdmin(accountAdddress).send({from:this.state.accounts[0]})
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })

  };

  addStoreOwner(accountAdddress){
    this.setState({loading:true});
    this.state.marketplaceContract.methods.addStoreOwner(accountAdddress).send({from:this.state.accounts[0]})

      
    .once('receipt', (receipt) => {
      
      this.setState({ loading: false })
    })

  };

  removeStoreOwner(accountAdddress){
    this.setState({loading:true});
    this.state.marketplaceContract.methods.removeStoreOwner(accountAdddress).send({from:this.state.accounts[0]})

    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })

  };

  async addStore(name){
    this.setState({loading:true});
    console.log('name:', name)
    let result=this.state.marketplaceContract.methods.addStore(name).send({from:this.state.accounts[0]})
    .once('receipt', (receipt) => {
      console.log('result:',result)
      console.log('receipt:',receipt)
      this.setState({ loading: false })
    })
  };

  removeStore(storeId){
    this.setState({loading:true});
    this.state.marketplaceContract.methods.removeStore(storeId).send({from:this.state.accounts[0]})
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })

  };

  async addProduct(name,price,storeId){
    this.setState({loading:true});
    //const web3 = await getWeb3();
    //web3.fromWei(
    this.state.marketplaceContract.methods.addProduct(name,price,storeId).send({from:this.state.accounts[0]})
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  };

  removeProduct(productId,storeId){
    this.setState({loading:true});
    console.log(productId);
    this.state.marketplaceContract.methods.removeProduct(productId,storeId).send({from:this.state.accounts[0]})
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  };
  withdrawFromStore(storeId){
    console.log("storeId")
    console.log(storeId)
    this.setState({loading:true});
    this.state.marketplaceContract.methods.withdrawStoreBalance(storeId).send({from:this.state.accounts[0]})
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  };
  purchaseProduct(productId,productPrice){
    this.setState({loading:true});
    this.state.marketplaceContract.methods.purchaseProduct(productId).send({from:this.state.accounts[0], value:this.state.web3.utils.toWei(productPrice)})
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  };

  async loadMarketAdmins()
  {
    this.setState({loading:true});
    const marketAdminsCount = await this.state.marketplaceContract.methods.getMarketAdminsCount().call();
      console.log(marketAdminsCount);
      for (var i = 0; i < marketAdminsCount; i++) {
        const marketAdminAddress = await this.state.marketplaceContract.methods.getMarketAdminMember(i).call();

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
    const storeOwnersCount = await this.state.marketplaceContract.methods.getStoreOwnersCount().call();
      for (var i = 0; i < storeOwnersCount; i++) {
        const storeOwnerAddress = await this.state.marketplaceContract.methods.getStoreOwnerMember(i).call();
        this.setState({
          storeOwners: [...this.state.storeOwners, storeOwnerAddress]
        })
      }
      this.setState({ loading: false})
  };

  async loadStores()
  {
    this.setState({loading:true});
    
    const storesCount=await this.state.marketplaceContract.methods.getStoreCount().call();
      for (var i = 0; i < storesCount; i++) {
        const store = await this.state.marketplaceContract.methods.getStore(i).call();
        this.setState({
          stores: [...this.state.stores, store]
        })
      }
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
        <div id="eventsLog">

        </div>
      </div>
    );
  }
}

export default App;
