 
import fs from 'fs'
import path from 'path'

import ganache from 'ganache-cli' 
import  Web3 from 'web3' 

import ethUtil from 'ethereumjs-util'
import EIP712Utils from '../lib/EIP712Utils.js'
import { expect } from 'chai'
 

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

describe("EIP712 Contract Testing", function() {
    it("deploys contract", async function() {

      ///let accounts = await web3.eth.getAccounts()
      let chainId = await web3.eth.net.getId()

      console.log('chainId',chainId)

      let primaryAccountAddress = testAccount.publicAddress

      console.log('primaryAccountAddress',primaryAccountAddress)

      let myEIP712Contract = await new web3.eth.Contract(abi)
          .deploy({data: "0x" + evm.bytecode.object, arguments: [ ]})
          .send({from:  primaryAccountAddress, gas: 5000000});
  
      let contractAddress = myEIP712Contract.options.address
      console.log("deployed contract at ", contractAddress)



      /*
      MAKE SURE YOU CHANGE THIS VARIABLE IF YOU MODIFY eip712-config.json!!!
      */
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



    console.log('chainId', chainId)

    const typedData = EIP712Utils.getTypedDataFromParams( 
      chainId,  
      contractAddress,
      customConfig,
      dataValues  
    )

    console.log('typedData', (typedData))
    let typedDatahash = EIP712Utils.getTypedDataHash(typedData) 

     

 

    /*
    This is what you would do in your frontend to make metamask pop up 
    This would output the signature value 
     let signResult = await  EIP712Helper.signTypedData( web3, from, JSON.stringify(typedDatahash)  )
         
  
     For this test only, the signature will be calculated from the pkey
    */


    var privateKey = testAccount.secretKey;
    var privKey = Buffer.from(privateKey.substring(2), 'hex')
 
       
    const sig =   ethUtil.ecsign( typedDatahash   , privKey );
 

    var signature =   EIP712Utils.signDataHash( typedDatahash, privateKey )



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
   
    /* 
    let recoveredSigner = EIP712Utils.recoverPacketSigner(typedData, signature)*/
    console.log('recoveredSigner', recoveredSigner )
      

      let args = Object.values(dataValues)
      args.push(signature)

      console.log('args', args )

      expect( recoveredSigner.toLowerCase()  ).to.eql(  dataValues.orderCreator.toLowerCase() )

      //let result = await myEIP712Contract.methods.verifyOffchainSignatureAndDoStuff(...args).send({from:  primaryAccountAddress })

      //console.log("result of method call: ", result)
    });
  });