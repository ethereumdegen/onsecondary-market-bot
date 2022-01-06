import fs from 'fs'
import path from 'path'
import Web3 from 'web3'
import web3utils from 'web3-utils'

import EIP712Utils from '../lib/EIP712Utils.js'


let customConfigJSON = fs.readFileSync(path.join('./lib/eip712-config.json'));
let customConfig = JSON.parse(customConfigJSON)



export default class MarketOrderHelper {


    /*
    INPUT 

     orderData = {
       chainId: chainId,
       storeContractAddress:storeContractAddress,
       
       orderCreator:orderCreator,
       nftContractAddress:nftContractAddress,
       nftTokenId:nftTokenId,
       currencyTokenAddress:currencyTokenAddress,
       currencyTokenAmount:currencyTokenAmount,
       nonce: nonce,
       expires:expires 

     }
    */
  static createAndSignOrder(orderData, privateKey){

    let dataValues = { 
        orderCreator: orderData.orderCreator,
        isSellOrder: orderData.isSellOrder,
        nftContractAddress:orderData.nftContractAddress,
        nftTokenId:orderData.nftTokenId,
        currencyTokenAddress:orderData.currencyTokenAddress,
        currencyTokenAmount:orderData.currencyTokenAmount,
        nonce:orderData.nonce,
        expires:orderData.expires,
    }

    const typedData = EIP712Utils.getTypedDataFromParams( 
        orderData.chainId,  
        orderData.storeContractAddress,
        customConfig,
        dataValues  
      ) 


    let typedDatahash = EIP712Utils.getTypedDataHash(typedData)        
  

    var signature = EIP712Utils.signDataHash( typedDatahash, privateKey )


    return  {
        chainId: orderData.chainId,
        storeContractAddress: orderData.storeContractAddress,
        orderCreator:orderData.orderCreator,
        nftContractAddress:orderData.nftContractAddress,
        nftTokenId:orderData.nftTokenId,
        currencyTokenAddress:orderData.currencyTokenAddress,
        currencyTokenAmount:orderData.currencyTokenAmount,
        nonce: orderData.nonce,
        expires:orderData.expires,
        signature: signature 
      }

 
  }

  static getPublicAddressFromPrivateKey(privateKey){
      let web3 = new Web3
      let account = web3.eth.accounts.privateKeyToAccount( privateKey );

      return account.address
  }


  static generateNonce(){
    return web3utils.randomHex(32)
  }
 
 
  static getDecimalsOfCurrencyToken(tokenAddress){
    tokenAddress = tokenAddress.toLowerCase()

    if(tokenAddress == "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
    || tokenAddress == "0x0000000000000000000000000000000000000010"){
        return 18
    }

    return null 
  }




}