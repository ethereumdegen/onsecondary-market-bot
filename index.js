

 import FileHelper from './lib/file-helper.js'
 import MarketBot from './lib/market-bot.js'

 let config = FileHelper.readJSONFile('./config.json')

async function start(){
  

    let marketBot = new MarketBot( config )

    marketBot.start() 

}


start()