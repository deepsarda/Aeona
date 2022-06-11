const dotenv = require("dotenv");
dotenv.config();

const aeonaClient = require("./structures/Client");
const config = require("./utils/config");
const dashboard = require("./dashboard");

//Override prototype
require("./structures/TextChannel").run();
require("./structures/Message").run();
require("./structures/InteractionResponses").run();

const logger = require("./utils/logger");
const { AutoPoster } = require('topgg-autoposter')


logger("Aeona", config.logs_webhook_url);
console.log("Launching Aeona...");
let client = new aeonaClient();

//Look for errors
process.on("uncaughtException", (err) => {
  console.error(err);
});

async function start() {
  while (!client.ready) {
    try {
      await client.start(config.token);
      console.log("Aeona is ready!");
      console.log("Launching dashboard...");
      dashboard(client);
      const poster=new AutoPoster(config.top_gg_autoposter ,client)

      poster.on('posted', (stats) => { // ran when succesfully posted
        console.log(`Posted stats to Top.gg | ${stats.serverCount} servers`)
      })
      //let channel=await client.channels.fetch("785776583502856193");
      //let msg=await channel.send({title:"Aeona is ready!",description:"Aeona is ready to serve you!\n\n Discord.js Text Channel Overriden!", content:"<@394320584089010179> <@794921502230577182>"});
      //msg.reply({title:"Aeona is ready!",description:"Aeona is ready to serve you!\n\n Discord.js Message Overriden!", content:"<@394320584089010179> <@794921502230577182>"});
      break;
    } catch (e) {
      console.log(e);
    }
  }
}
start();
