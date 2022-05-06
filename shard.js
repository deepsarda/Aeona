const dotenv = require("dotenv").config();
const config = require("./config.json");
const logger = require("./utils/logger");
const Discord = require("discord.js");
const Statcord = require("statcord.js");
const { token } = require("./utils/variables.js");
const { AutoPoster } = require("topgg-autoposter");

process.on("uncaughtException", (err, origin) => {
  logger.error(err);
});
const manager = new Discord.ShardingManager("./index.js", {
  token: token,
  //autoSpawn: true,
  // totalShards: 'auto'
  totalShards: 1,
});
const poster = AutoPoster(process.env.TOKEN, manager);
manager.spawn();

// Create statcord client
const statcord = new Statcord.ShardingClient({
  manager,
  key: process.env.STATCORD,
});



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
  manager.statcord = statcord;
  statcord.autopost();
});
