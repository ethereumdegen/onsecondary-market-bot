
import MarketOrderHelper from './market-order-helper.js' 
import StarflaskApiHelper from './starflask-api-helper.js'
 

export default class ScriptInterpreter {
    

    static async getCurrentBlockNumber(botConfig){

        let apiURLBase = botConfig.marketAPIURL
        let apiURI = `${apiURLBase}/api/v1/token`

        let inputData = {"requestType":"server_data"} 


        console.log('ask ',apiURI,inputData)

        let response = await StarflaskApiHelper.resolveStarflaskQuery(apiURI, inputData )
        console.log('got back',response)
        return response.output.latestBlockNumber
    }

    static async interpretScript(scriptConfig, botConfig){
        console.log('running Script ', scriptConfig, botConfig)

        let currentBlockNumber = await ScriptInterpreter.getCurrentBlockNumber(botConfig)

        if(isNaN(currentBlockNumber)){
            console.error("ERROR: current block number NAN")
            return 
        }

        let program = scriptConfig.program.toLowerCase() 
        console.log('program',program)
        if(program == "staticbid"){
            console.log('execute program: static bid ')



            let privateKey = botConfig.accountPrivateKey
            let accountPublicAddress = MarketOrderHelper.getPublicAddressFromPrivateKey(privateKey)


            let nftTokenId = scriptConfig.nftTokenIds[0]
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
                nonce: MarketOrderHelper.generateNonce(),
                expires: expires 

            }



            let orderParameters = MarketOrderHelper.createAndSignOrder( orderData, privateKey )

            let apiURLBase = botConfig.marketAPIURL
            let apiURI = `${apiURLBase}/api/v1/token`

            let inputData = {requestType: "save_new_order", input: orderParameters }

            console.log('orderParameters',orderParameters)

            let response = await StarflaskApiHelper.resolveStarflaskQuery(apiURI, inputData )
            console.log('program response :',response)
        }








    }




}