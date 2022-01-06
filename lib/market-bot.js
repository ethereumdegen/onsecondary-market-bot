


import Web3 from 'web3'
 
import FileHelper from './file-helper.js'


export default class MarketBot  {

    constructor(config){
        this.config = config  

    }


    start(){    
        console.log('Booting Market Bot.') 
        
        let loadedScripts = []
        let intervals = []

        for(let scriptName of this.config.scripts){
            console.log('loading script',scriptName)
            let loadedScript = FileHelper.readJSONFile(`./scripts/${scriptName}`)
            loadedScripts.push(loadedScript)

             setTimeout( function(){this.interpretScript( loadedScript )}.bind(this) ,  0 )
            let newInterval = setInterval( function(){this.interpretScript( loadedScript )}.bind(this) , loadedScript.intervalSeconds*1000 )

        } 

    }

    interpretScript(scriptConfig){
        console.log('running Script ', scriptConfig)
    }



}