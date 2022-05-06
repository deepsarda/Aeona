const config = require("./config.json");
const logger = require("./utils/logger");
const Discord = require("discord.js");
const Statcord = require("statcord.js");
const { token } = require("./utils/variables.js");
const { AutoPoster } = require('topgg-autoposter')
var exec = require('child_process').exec;
function execute(command, callback){
    exec(command, function(error, stdout, stderr){ callback(stdout); });
};

execute("git remove -v",function(remotes){
    console.log(remotes);
})
process.on("uncaughtException", (err, origin) => {});
const manager = new Discord.ShardingManager("./index.js", {
  token: token,
  //autoSpawn: true,
 // totalShards: 'auto'
  totalShards: 1,
});
const poster = AutoPoster(process.env.TOKEN, manager)
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
