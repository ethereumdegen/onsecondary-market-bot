import fs from 'fs'
import path from 'path'

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

 
 
 




}