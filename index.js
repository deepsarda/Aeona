const dotenv = require("dotenv");
dotenv.config();

const aeonaClient = require("./structures/Client");
const config = require("./utils/config");
const dashboard = require("./dashboard");

//Override prototype
require("./structures/TextChannel").run();
require("./structures/Message").run();
const logger = require("./utils/logger");
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
