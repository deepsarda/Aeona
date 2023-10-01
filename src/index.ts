import { ClusterManager, HeartbeatManager } from 'discord-hybrid-sharding';
import colors from 'colors';
import dotenv from 'dotenv';
import { configs } from './utils/config.js';
dotenv.config();

for (const config of configs) {
  const manager = new ClusterManager('./build/bot.js', {
    token: config.token,
    totalShards: 'auto', // amount or: "auto"
    shardsPerClusters: 9000, // amount of shards / cluster
    mode: 'process', // "process" or: "worker"
    respawn: true,
  });

  manager.extend(
    new HeartbeatManager({
      interval: 2000, // Interval to send a heartbeat
      maxMissedHeartbeats: 5, // Maximum amount of missed Heartbeats until Cluster will get respawned
    }),
  );
  manager.on('clusterCreate', (cluster) => {
    console.log(
      `[SHARDING-MANAGER]`.magenta +
        `[${config.name}]:`.yellow +
        `Launched Cluster #${cluster.id} | ${cluster.id + 1}/${cluster.manager.totalClusters} [${
          cluster.manager.shardsPerClusters
        }/${cluster.manager.totalShards} Shards]`.green,
    );

    cluster.on('death', function () {
      console.log(`[${config.name}]:`.yellow + `${colors.red.bold(`Cluster ${cluster.id} died..`)}`);
    });

    cluster.on('error', (e) => {
      console.log(`[${config.name}]:`.yellow + `${colors.red.bold(`Cluster ${cluster.id} errored ..`)}`);
      console.error(e);
    });

    cluster.on('disconnect', function () {
      console.log(`[${config.name}]:`.yellow + `${colors.red.bold(`Cluster ${cluster.id} disconnected..`)}`);
    });

    cluster.on('reconnecting', function () {
      console.log(`[${config.name}]:`.yellow + `${colors.yellow.bold(`Cluster ${cluster.id} reconnecting..`)}`);
    });

    cluster.on('close', function (code) {
      console.log(`[${config.name}]:`.yellow + `${colors.red.bold(`Cluster ${cluster.id} close with code ${code}`)}`);
    });

    cluster.on('exit', function (code) {
      console.log(`[${config.name}]:`.yellow + `${colors.red.bold(`Cluster ${cluster.id} exited with code ${code}`)}`);
    });

    cluster.on('message', async (msg: any) => {
      if (msg.log) {
        console.log(`[${config.name}]:`.yellow + msg.log);
        fetch('https://dashboard.aeonabot.xyz/stats/logs/update', {
          method: 'post',
          body: JSON.stringify(`[${config.name}]:`.yellow + msg.log),
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + process.env.apiKey },
        }).catch((err) => console.log(err));
      }
    });
  });
  // Log the creation of the debug
  manager.once('debug', (d) =>
    d.includes('[CM => Manager] [Spawning Clusters]') ? console.log(`[${config.name}]:`.yellow + d) : '',
  );

  manager.spawn({ timeout: -1 });

  async function submitstats() {
    let guilds = await manager.broadcastEval((c) => c.guilds.cache.size);
    let users = await manager.broadcastEval((c) => c.guilds.cache.map((guild) => guild.members.cache.size));
    let channels = await manager.broadcastEval((c) => c.guilds.cache.map((guild) => guild.channels.cache.size));
    let ping = await manager.broadcastEval((c) => c.ws.ping);

    let list = [];

    for (const shard in guilds) {
      let guildc = guilds[shard];
      let userc = users[shard].reduce((p, n) => p + n, 0);
      let channelc = channels[shard].reduce((p, n) => p + n, 0);
      let pingc = ping[shard];

      if (pingc === -1) continue;

      list.push({
        id: shard,
        ping: pingc,
        guilds: guildc,
        channels: channelc,
        users: userc,
      });
    }

    await fetch('https://dashboard.aeonabot.xyz/stats/shards/update', {
      method: 'post',
      body: JSON.stringify(list),
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + process.env.apiKey },
    }).catch((err) => console.log(err));
  }
  setInterval(submitstats, 15000);
}
