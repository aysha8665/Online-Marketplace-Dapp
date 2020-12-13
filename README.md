# Online Marketplace

This repository contains the implementation of a marketplace in Solidity. 
It is the final project for the ConsenSys Developer Bootcamp. 

*** 

# Running the Project 

## Requirements 

To run this project, you will need the following:
- Truffle (`npm install -g truffle`)
- Ganache GUI
	- You can also Ganache CLI (`npm install -g ganache-cli`)
- OpenZeppelin (`npm install openzeppelin-solidity`)
- jquery (`npm install jquery`)
- MetaMask 

## Getting Stared 

Run Ganache GUI

open two terminal windows and `cd` into the top-level directory of this project.
In the terminal window, run `truffle migrate` to deploy your contracts on your local blockchain. 
Once the migration is complete, In the second terminal window, `cd` into the `client` directory of this project.
run `npm run start` for the application to start. A window should automatically open to `localhost:3000`. If not, open your browser which uses MetaMask and enter `localhost:3000` as the URL. 

Open the MetaMask extension, Log Out of your current account (**if your current account is on the main net, be sure to save your mnemonic/passphrase somewhere!**), and then click "Restore from seed phrase". Copy an paste `MNEMONIC` from Ganache GUI and set a temporary password. 

Once logged into your account, choose `Custom RPC` as your network and in the `New RPC URL` form, copy/paste the IP address from the which the `ganache-cli` terminal is `Listening on` (it is likely `127.0.0.1:8545` and you will see `RPC Server` on Ganache GUI. 

After this, you should be able to use MetaMask to interact with the application. If you are logged in properly and on the right network, you will see the `Admin Dashboard (Owner)` once MetaMask is configured, after refreshing the page.

## Testing 

To run the tests, from the main directory of the project, run `truffle test`.
Or again from the main directory of the project,`truffle develop`. Then, from the console, run `test`. Both commands have to be run. 

All tests should pass, but tests that involve buying products sometimes fail because of rounding errors. If this is the case, you should see an error such as `ProviderError: connection not open on send()`. You can typically get the tests to pass by simply re-running them. The rounding errors tend to happen if you run the tests over and over on the same blockchain with the same accounts (i.e. without restarting `Ganache GUI`). Simply restarting the local blockchain can sometimes make everything pass. 

Each of the two contracts has `.sol` and `.js` tests, all located under `/test`.

## Recording
https://drive.google.com/file/d/1I-y7s-McjxmBAaJefTYT2Clao-tp8Awz/view?usp=sharing



