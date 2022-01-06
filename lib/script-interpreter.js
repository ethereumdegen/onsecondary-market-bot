
import MarketOrderHelper from './market-order-helper.js' 
import StarflaskApiHelper from './starflask-api-helper.js'
 

export default class ScriptInterpreter {
    

    static async getCurrentBlockNumber(){



    }

    static async interpretScript(scriptConfig, botConfig){
        console.log('running Script ', scriptConfig, botConfig)

        let currentBlockNumber = await ScriptInterpreter.getCurrentBlockNumber()

        if(isNaN(currentBlockNumber)){
            console.error("ERROR: current block number NAN")
            return 
        }

        let program = scriptConfig.program.toLowerCase() 

        if(program == "staticbid"){
            console.log('execute program: static bid ')



            let privateKey = botConfig.accountPrivateKey
            let accountPublicAddress = MarketOrderHelper.getPublicAddressFromPrivateKey(privateKey)


            let nftTokenId = nftTokenIds[0]
            let expires = parseInt(currentBlockNumber) + parseInt( scriptConfig.expiresIn ) 
            
            let orderData = {
                chainId: scriptConfig.chainId,
                storeContractAddress: scriptConfig.storeContractAddress,

                orderCreator: accountPublicAddress,
                isSellOrder: scriptConfig.isSellOrder,
                nftContractAddress: scriptConfig.nftContractAddress,
                nftTokenId: nftTokenId,
                currencyTokenAddress: scriptConfig.currencyTokenAddress,
                currencyTokenAmount: scriptConfig.currencyTokenAmount,
                expires: expires 

            }



            let orderParameters = MarketOrderHelper.createAndSignOrder( orderData, privateKey )

            let apiURLBase = botConfig.marketAPIURL
            let apiURI = `${apiURLBase}/api/v1/token`

            let inputData = {requestType: "save_new_order", input: orderParameters }

            let response = StarflaskApiHelper.resolveStarflaskQuery(apiURI, inputData )
            console.log('program response :',response)
        }








    }




}