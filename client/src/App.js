import React, { Component } from "react";
import $ from 'jquery';
import AdministeredContract from "./contracts/Marketplace.json";
import MarketplaceContract from "./contracts/Marketplace.json";
import getWeb3 from "./getWeb3";

import "./App.css";
import AdminDashboard from './dashboard-admin'
import MarketAdminDashboard from './dashboard-market-admin'
import StoreOwnerDashboard from './dashboard-store-owner'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      web3: null, 
      userRole:'user',
      accounts: null, 
      administeredContract: null,
      marketplaceContract: null,
      marketAdmins:[],
      storeOwners:[],
      stores:[],
      products:[],
      loading:true,
     }
     this.addMarketAdmin = this.addMarketAdmin.bind(this)
     this.removeMarketAdmin = this.removeMarketAdmin.bind(this)
     this.addStoreOwner = this.addStoreOwner.bind(this)
     this.removeStoreOwner = this.removeStoreOwner.bind(this)
     this.addStore = this.addStore.bind(this)
     this.removeStore = this.removeStore.bind(this)
     this.addProduct = this.addStore.bind(this)
     this.removeProduct = this.removeStore.bind(this)
     this.withdrawFromStore = this.withdrawFromStore.bind(this)
  }
 

  
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetworkAdministeredContract = AdministeredContract.networks[networkId];
      const deployedNetworkMarketplaceContract = MarketplaceContract.networks[networkId];
      
      const administeredContractInstance = new web3.eth.Contract(
        AdministeredContract.abi,
        deployedNetworkAdministeredContract && deployedNetworkAdministeredContract.address,
      );

      const marketplaceContractInstance = new web3.eth.Contract(
        MarketplaceContract.abi,
        deployedNetworkMarketplaceContract && deployedNetworkMarketplaceContract.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, userRole:'user', accounts, 
      administeredContract: administeredContractInstance,
      marketplaceContract:marketplaceContractInstance,
      marketAdmins:[],
      loading:true}, this.checkUserRole);

/*
      var addMarketAdminEvent = this.state.administeredContract.RoleGranted();
      addMarketAdminEvent.watch(function(error, result){
        if (!error)
            {
                //$("#loader").hide();
                $("#eventsLog").html(result.args.role + '-' + result.args.account + '-'+ result.args._msgSender);
            } else {
                //$("#loader").hide();
                console.log(error);
            }
            */
           /*marketplaceContractInstance.events.LogStoreAdded.watch(function(error, result){
             if (!error)
                 {
                     //$("#loader").hide();
                     $("#eventsLog").html(result.args.role + '-' + result.args.account + '-'+ result.args._msgSender);
                 } else {
                     //$("#loader").hide();
                     console.log(error);
                 }


    })*/

    /*marketplaceContractInstance.getPastEvents('LogStoreAdded', {
      filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'}, // Using an array means OR: e.g. 20 or 23
      fromBlock: 0,
      toBlock: 'latest'
  }, function(error, events){ console.log(events); })
  .then(function(events){
      console.log(events) // same results as the optional callback above
  });*/
      
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
      this.setState({userRole:'storeOwner'}, this.loadStores);
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
          return <StoreOwnerDashboard 
          stores={this.state.stores}
          products={this.state.products}
          addStore={this.addStore}
          removeStore={this.removeStore}
          addProduct={this.addProduct}
          removeProduct={this.removeProduct}
          />
      
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

  addProduct(name,price,storeId){
    this.setState({loading:true});
    this.state.marketplaceContract.methods.addProduct(name,price,storeId).send({from:this.state.accounts[0]})
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  };

  removeProduct(productId){
    this.setState({loading:true});
    this.state.marketplaceContract.methods.removeProduct(productId).send({from:this.state.accounts[0]})
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  };
  withdrawFromStore(storeId){
    this.setState({loading:true});
    this.state.marketplaceContract.methods.withdrawStoreBalance(storeId).send({from:this.state.accounts[0]})
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
        const marketAdminAddress = await this.state.administeredContract.methods.getMarketAdminMember(i).call();
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
        const storeOwnerAddress = await this.state.administeredContract.methods.getStoreOwnerMember(i).call();
        this.setState({
          storeOwners: [...this.state.storeOwners, storeOwnerAddress]
        })
      }
      console.log(this.state.storeOwners)
      this.setState({ loading: false})
  };

  async loadStores()
  {
    this.setState({loading:true});
    const storesCount = await this.state.marketplaceContract.methods.getStoreCount().call();
      console.log(storesCount);
      for (var i = 0; i < storesCount; i++) {
        const store = await this.state.marketplaceContract.methods.getStore(i).call();
        this.setState({
          stores: [...this.state.stores, store]
        })
      }
      console.log(this.state.stores)
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
