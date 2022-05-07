const dotenv = require("dotenv").config();
const config = require("./config.json");
const logger = require("./utils/logger");
const Discord = require("discord.js");
const Statcord = require("statcord.js");
const { token } = require("./utils/variables.js");
const { AutoPoster } = require("topgg-autoposter");


const manager = new Discord.ShardingManager("./index.js", {
  token: token,
  //autoSpawn: true,
  // totalShards: 'auto'
  totalShards: 1,
});
const poster = AutoPoster(process.env.TOKEN, manager);
// Create statcord client
const statcord = new Statcord.ShardingClient({
  manager,
  key: process.env.STATCORD,
});

//Expose the statcord client to the rest of the code
module.exports = statcord;

statcord.on("post", status => {
  // status = false if the post was successful
  // status = "Error message" or status = Error if there was an error
  if (!status) logger.info("Successful post");
  else console.error(status);
});

manager.spawn();


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


