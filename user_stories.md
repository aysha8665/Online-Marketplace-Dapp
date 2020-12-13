# User Stories
The goal of this section is to explain to graders how to use the app to evaluate the various user stories. 

#### Important 
	- You will need to refresh the page manually after a transaction has confirmed to see the updated state (ex: if creating a new storefront, wait for the transaction to confirm, refresh, and the storefront will be there)


## List Of Stores  
### Story
There are a list of `Stores` on a `User Dashboard`. In order to see products click on `Display Products` where shoppers can purchase `Products` posted by the Store Owners.

### Try It Out 
After having created storefronts (see below), go to the homepage (`http://localhost:3000/`) with an account that is neither an `admin` or `Store Owner` and you will see a list of all storefronts. 


## Admin MarketAdmin Management 

### Story 
An administrator opens the web app. The web app reads the address and identifies that the user is an admin, showing them admin only functions, such as managing Market Admins. 

### Try It Out
The account that deploys the contract will by default be an `default admin`. After deploying the contract, simply log into the first account on MetaMask associated with your passphrase and admin only functions will be shown. 

### Story 
An admin adds an address to the list of approved Market Admins, so if the owner of that address logs into the app, they have access to the Market Admins functions, such as managing Market Admins. 

### Try It Out
To do this, first you will need to visit the homepage (`http://localhost:3000/`) with a `admin` account, and paste address that you want to add as market admin. click the `Add Market Admin` button. 

Once your transaction has confirmed, refresh the page. Under the `Market Admin List` header, you should see the address of the account that you added. 

switch back to the account from which you created the Market Admin, and it should now display Market Admin functions. 

### Note
To add more Store Owner, simply visit the home page as an `admin` and enter a desired `Market Admins`'s address in the `Add Market Admins` form. After the transaction is confirmed, that account will now also be an `Market Admins`. 


## MarketAdmin Marketplace Management 

### Story 
An MarketAdmin opens the web app. The web app reads the address and identifies that the user is an MarketAdmin, showing them MarketAdmin only functions, such as managing Market Admins. 

### Try It Out
log into the MarketAdmin account on MetaMask associated and MarketAdmin only functions will be shown. 

### Story 
An Market Admins adds an address to the list of approved Store Owners, so if the owner of that address logs into the app, they have access to the Store Owners functions, such as managing stores owners. 

### Try It Out
To do this, first you will need to visit the homepage (`http://localhost:3000/`) with a `Market Admins` account, and paste address that you want to add as Store Owner. click the `Add Store Owner` button. 

Once your transaction has confirmed, refresh the page. Under the `Store Owner List` header, you should see the address of the account that you added. 

switch back to the account from which you created the Store Owner, and it should now display Store Owner functions. 


### Note
To add more Store Owner, simply visit the home page as an `Market Admins` and enter a desired `Store Owner`'s address in the `Add Store Owner` form. After the transaction is confirmed, that account will now also be an `Store Owner`. 

## Store Owner Functionality 

### Story 
An approved Store Owner logs into the app. The web app recognizes their address and identifies them as a Store Owner. They are shown the Store Owner functions. 

### Try It Out 
See `Store Owner Dashboard` above to make an account a `Store Owner`. After this, the homepage (`http://localhost:3000/`) should display Store Owner functionality. 

### Story 
They can Add a Store that will be displayed on the Store Owner Dashboard. They can also see the stores that they have already created. They can click on a Display products to manage products. 

### Try It Out 
With a `Store Owner` account, on the homepage, you will see a `Add a Store` section. There, you can enter the name for a new store, and after clicking `Add a Store`, it will be created. After the transaction has confirmed, refresh the page to see the new store front, along with its `name` and `balance` under `Your Store list. To manage the product, simply click on a Display products. 


### Story 
They can add/remove products to the storefront. 

### Try It Out 

#### Adding a Product
As a `Store Owner`, click on `Display products` Button of any added store from the homepage. fill in the information in the `Add a Product` section, and click the button. After the transaction is confirmed, refresh the page and click on `Display products` Button, the product should appear in the `Products List` section.  


#### Removing a Product
As a `Store Owner`, click on `Remove Button` on any added store from the Store Owner Dashboard. after having added a product, in the `Products List` section, you will be able to remove a product by clicking on the "Remove" button. Once the transaction is confirmed, refresh the page to see that the product is not displayed anymore. 

### Story 
They can  withdraw any funds that the store has collected from sales.

### Try It Out 
As a `Store Owner`, visit the homepage (`http://localhost:3000/`). Under the name and ID of each store front, the balance will be listed. A `Store Owner` can use the `Withdraw` button to withdraw the total balance of a  store. After the transaction has confirmed, the balance for that store will now be 0, and the `Store Owner`'s account balance will have been incremented by the total balance of the store. 

## Shopper Functionality 

### Story 
A shopper logs into the app. The web app does not recognize their address so they are shown the User Dashboard. From the main page they can browse all of the stores that have been added in the online marketplace. Clicking on the `Display products` button will take them to a product page. 

### Try It Out 
After having created at least one store front, simply visit the homepage (`http://localhost:3000/`) with any account that is neither an `admin`, `Market Admin` or `Store Owner` to see a list of all store fronts with links to each of them. 

### Story 
They can see a list of products offered by the store, including their price and id. Shoppers can purchase a product, which will debit their account and send it to the store. 

### Try It Out 
To purchase a product, on a store front page, simply click `purchase` on desired product. A transaction will be created with the amount being the price of the product multiplied by the quantity. Once the transaction is confirmed, the value will be sent to the contract. 