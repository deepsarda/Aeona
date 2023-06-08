import { ClusterManager } from "discord-hybrid-sharding";
import colors from "colors";

const manager = new ClusterManager("./main.js", {
  token: process.env.BOTTOKEN,
  totalShards: "auto", // amount or: "auto"
  shardsPerClusters: 9000, // amount of shards / cluster
  mode: "process", // "process" or: "worker"
  respawn: true,
});

manager.on("clusterCreate", (cluster) => {
  console.log(
    `[SHARDING-MANAGER]: `.magenta +
      `Launched Cluster #${cluster.id} | ${cluster.id + 1}/${
        cluster.manager.totalClusters
      } [${cluster.manager.shardsPerClusters}/${
        cluster.manager.totalShards
      } Shards]`.green
  );

  cluster.on("death", function () {
    console.log(`${colors.red.bold(`Cluster ${cluster.id} died..`)}`);
  });

  cluster.on("error", (e) => {
    console.log(`${colors.red.bold(`Cluster ${cluster.id} errored ..`)}`);
    console.error(e);
  });

  cluster.on("disconnect", function () {
    console.log(`${colors.red.bold(`Cluster ${cluster.id} disconnected..`)}`);
  });

  cluster.on("reconnecting", function () {
    console.log(
      `${colors.yellow.bold(`Cluster ${cluster.id} reconnecting..`)}`
    );
  });

  cluster.on("close", function (code) {
    console.log(
      `${colors.red.bold(`Cluster ${cluster.id} close with code ${code}`)}`
    );
  });

  cluster.on("exit", function (code) {
    console.log(
      `${colors.red.bold(`Cluster ${cluster.id} exited with code ${code}`)}`
    );
  });
});
// Log the creation of the debug
manager.once("debug", (d) =>
  d.includes("[CM => Manager] [Spawning Clusters]") ? console.log(d) : ""
);

manager.spawn({ timeout: -1 });
