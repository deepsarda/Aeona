const dotenv = require("dotenv");
dotenv.config();

const aeonaClient = require("./structures/Client");
const config = require("./utils/config");
const dashboard = require("./dashboard");
const logger = require("./utils/logger");
logger("Aeona", config.logs_webhook_url);
console.log("Launching Aeona...");
let client= new aeonaClient();

async function start() {
  while (!client.ready) {
    try {
      await client.start(config.token);
      console.log("Aeona is ready!");
      console.log("Launching dashboard...");
      dashboard(client);
    } catch (e) {
      console.log(e);
    }
  }
}
start();
