


import Web3 from 'web3'
 
import FileHelper from './file-helper.js'
import ScriptInterpreter from './script-interpreter.js'

export default class MarketBot  {

    constructor(config){
        this.config = config  

    }


    start(){    
        console.log('Booting Market Bot.') 
        
        let loadedScripts = []
        let intervals = []

        let botConfig = this.config 

        for(let scriptName of this.config.scripts){
            console.log('loading script',scriptName)
            let loadedScript = FileHelper.readJSONFile(`./scripts/${scriptName}`)
            loadedScripts.push(loadedScript)

             setTimeout( function(){ScriptInterpreter.interpretScript( loadedScript, botConfig )}  ,  0 )
            let newInterval = setInterval( function(){ScriptInterpreter.interpretScript( loadedScript, botConfig)}  , loadedScript.intervalSeconds*1000 )

        } 

    }

   


}