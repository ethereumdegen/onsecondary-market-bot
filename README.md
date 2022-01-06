#### On Secondary Market Bot 

#### Pre-requisites
- Nodejs 14 
- >> clone this repo
- >> npm install 


1. Be sure to approve your WETH(if bidding [isSellOrder:false]) and NFTs(if listing [isSellOrder:true]) to the store contract address: 0x0419732028fa499200a0e36972e4c139e98d28e1

2. Define secrets in 'config.json'  (see config.sample.json for format) [DO NOT ever share or commit this file]

3. Edit 'myfirstscript.json' to configure it with the correct type of NFT address, token Ids, and prices for your bids that you want to place 

4. run 'npm run start' to start the bot 

