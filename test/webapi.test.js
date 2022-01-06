 
import fs from 'fs'
import path from 'path'

import ganache from 'ganache-cli' 
import  Web3 from 'web3' 

import ethUtil from 'ethereumjs-util'
import EIP712Utils from '../lib/EIP712Utils.js'
import { expect } from 'chai'

import StarflaskAPIHelper from '../lib/starflask-api-helper.js'
 

let testAccount = {
  publicAddress: '0x95eDA452256C1190947f9ba1fD19422f0120858a',
  secretKey: "0x31c354f57fc542eba2c56699286723e94f7bd02a4891a0a7f68566c2a2df6795",
  balance: "1000000000000000000000000000000000"

}

const ganacheOptions = { gasLimit: 8000000, accounts:[testAccount] };

const provider = ganache.provider( ganacheOptions )
const OPTIONS = {
  defaultBlock: "latest",
  transactionConfirmationBlocks: 1,
  transactionBlockTimeout: 5 
};

 
 
const web3 = new Web3(provider, null, OPTIONS);

let customConfigJSON = fs.readFileSync(path.join('./lib/eip712-config.json'));
let customConfig = JSON.parse(customConfigJSON)

//const { abi, evm } = require('../compile');
let contractJSON = fs.readFileSync(path.join('./contracts/built/BlockStore.json'));
let contractData = JSON.parse(contractJSON)

let abi = contractData.abi
let evm = contractData.evm

describe("Web API test", function() {
    it("Submits Order to API", async function() {
 
      let chainId =  1

      console.log('chainId',chainId)

      let primaryAccountAddress = testAccount.publicAddress

      console.log('primaryAccountAddress',primaryAccountAddress)

      //mainnet deployed
      let contractAddress = "0x0419732028fa499200a0e36972e4c139e98d28e1"


    
      let dataValues = {
        
        orderCreator: primaryAccountAddress,
        isSellOrder:false,
        nftContractAddress:"0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
        nftTokenId: 2,
        currencyTokenAddress:"0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
        currencyTokenAmount:100, 
        nonce:"0x695d08147db544da227e479d03eca34317fb52727d6d61a6ce981ad0e66a8bf5",
        expires:50000 
    }

 
    const typedData = EIP712Utils.getTypedDataFromParams( 
      chainId,  
      contractAddress,
      customConfig,
      dataValues  
    ) 
 
    let typedDatahash = EIP712Utils.getTypedDataHash(typedData)        

    var privateKey = testAccount.secretKey;   

    var signature = EIP712Utils.signDataHash( typedDatahash, privateKey )

 
     let inputParameters = {
       chainId: chainId,
       storeContractAddress:contractAddress,
       orderCreator:dataValues.orderCreator,
       nftContractAddress:dataValues.nftContractAddress,
       nftTokenId:dataValues.nftTokenId,
       currencyTokenAddress:dataValues.currencyTokenAddress,
       currencyTokenAmount:dataValues.currencyTokenAmount,
       nonce: dataValues.nonce,
       expires:dataValues.expires,
       signature: signature 
     }

     console.log('inputParameters',inputParameters)

     let recoveredSigner = EIP712Utils.recoverOrderSigner(  inputParameters   )
    
     console.log('recoveredSigner', recoveredSigner )

      let apiURI = 'http://localhost:4000/api/v1/token'
      let inputData = {requestType: "save_new_order", input: inputParameters }

      let response = await StarflaskAPIHelper.resolveStarflaskQuery( apiURI , inputData ) 

      console.log('response,',response)

      expect(response).to.exist
  

      //let result = await myEIP712Contract.methods.verifyOffchainSignatureAndDoStuff(...args).send({from:  primaryAccountAddress })

      //console.log("result of method call: ", result)
    });
  });