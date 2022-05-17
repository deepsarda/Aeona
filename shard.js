process.on("uncaughtException", (err, origin) => {
  console.log("An error occured" + err);
});

console.log("starting");
const dotenv = require("dotenv").config();
const logger = require("./utils/logger");
const Discord = require("discord.js");
const { token } = require("./utils/variables.js");
const { AutoPoster } = require("topgg-autoposter");
const Statcord = require("statcord.js");
const { Console } = require("console");

let manager = new Discord.ShardingManager("./index.js", {
  token: token,
  //autoSpawn: true,
  // totalShards: 'auto'
  totalShards: 1,
});
const poster = AutoPoster(process.env.TOKEN, manager);

let statcord = new Statcord.ShardingClient({
  manager,
  key: process.env.STATCORD,
});

statcord.on("autopost-start", () => {
  // Emitted when statcord autopost starts
  console.log("Started autopost");
});

statcord.on("post", (status) => {
  // status = false if the post was successful
  // status = "Error message" or status = Error if there was an error
  if (status) console.error(status);
});
async function start() {
  while (true) {
    try {
      console.log("Attempting to spawn shards");
      await manager.spawn();
      console.log("Shards spawned");
      return;
    } catch (e) {
      if (e.message.includes("spawn")) {
        console.log("Shards already spawned");
        return;
      }
      console.log(e);
      manager = new Discord.ShardingManager("./index.js", {
        token: token,
        //autoSpawn: true,
        // totalShards: 'auto'
        totalShards: 1,
      });
    }
  }
}
start();
manager.on("shardCreate", (shard) => {
  logger.info(`Launching Shard ${shard.id + 1}`, { label: `Shard` });
  manager
    .fetchClientValues("guilds.cache.size")
    .then((results) =>
      console.log(
        `${results.reduce((prev, val) => prev + val, 0)} total guilds`
      )
    )
    .catch(console.error);
});
