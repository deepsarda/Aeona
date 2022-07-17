const dotenv = require("dotenv");
dotenv.config();

const aeonaClient = require("./structures/Client");
const config = require("./utils/config");
const dashboard = require("./dashboard");
const { AutoPoster } = require("topgg-autoposter");

//Override prototype
require("./structures/TextBasedChannel").run();
require("./structures/TextChannel").run();
require("./structures/Message").run();
require("./structures/MessageComponentInteraction").run();
require("./structures/CanvasSenpai").run();
const logger = require("./utils/logger");

logger("Aeona", config.logs_webhook_url);
let client = new aeonaClient();

//Rank
const { CanvasSenpai } = require("canvas-senpai");
const canva = new CanvasSenpai();
const Discord = require("discord.js");
//Dont remove this, it is one of the ways to give credits

console.log(` ▄▄▄      ▓█████  ▒█████   ███▄    █  ▄▄▄`);
console.log(`▒████▄    ▓█   ▀ ▒██▒  ██▒ ██ ▀█   █ ▒████▄`);
console.log(`▒██  ▀█▄  ▒███   ▒██░  ██▒▓██  ▀█ ██▒▒██  ▀█▄ `);
console.log(`░██▄▄▄▄██ ▒▓█  ▄ ▒██   ██░▓██▒  ▐▌██▒░██▄▄▄▄██`);
console.log(` ▓█   ▓██▒░▒████▒░ ████▓▒░▒██░   ▓██░ ▓█   ▓██▒`);
console.log(` ▒▒   ▓▒█░░░ ▒░ ░░ ▒░▒░▒░ ░ ▒░   ▒ ▒  ▒▒   ▓▒█░`);
console.log(`  ▒   ▒▒ ░ ░ ░  ░  ░ ▒ ▒░ ░ ░░   ░ ▒░  ▒   ▒▒ ░`);
console.log(`  ░   ▒      ░   ░ ░ ░ ▒     ░   ░ ░   ░   ▒   `);
console.log(`      ░  ░   ░  ░    ░ ░           ░       ░  ░`);
console.log(`Made by Si6gma, Multii and DeepSarda`); //Add our own name if you changed anything!

//Look for errors
process.on("uncaughtException", (err) => {
  console.error(err);
});

async function start() {
  while (!client.ready) {
    try {
      await client.start(config.token);
      console.log(client.user.username + " is online!");
      console.log("Launching dashboard...");
      dashboard(client);
      const poster = new AutoPoster(config.top_gg_autoposter, client);

      poster.on("posted", (stats) => {
        // ran when succesfully posted
        console.log(`Posted stats to Top.gg | ${stats.serverCount} servers`);
      });
      let channel = await client.channels.fetch("960053538115952685");
      let msg = await channel.send({
        title: client.user.username,
        description:
          client.user.username +
          " is ready to serve you!\n\n Discord.js Text Channel Overriden!",
        content: "_ _",
      });
      msg.reply({
        title: client.user.username,
        description:
          client.user.username +
          " is ready to serve you!\n\n Discord.js Message Overriden!",
        content: "_ _",
      });

      let user = await client.users.fetch("794921502230577182");
      let user2 = await client.users.fetch("830231116660604951");
      let user3 = await client.users.fetch("660442372814929930");
      let user4 = await client.users.fetch("394320584089010179");

      profile(user, channel);
      profile(user2, channel);
      profile(user3, channel);
      profile(user4, channel);

      break;
    } catch (e) {
      console.log(e);
    }
  }
}
start();

async function profile(user, channel) {
  let data = await canva.profile({
    name: user.username,
    discriminator: user.discriminator,
    avatar: user.displayAvatarURL({ format: "png" }),
    background: user.banner
      ? user.bannerURL({ format: "png", size: 4096 })
      : null,
    rank: 1,
    xp: Math.floor(Math.random() * 69420),
    level: Math.floor(Math.random() * 100),
    maxxp: 69420,
    blur: false,
  });

  const attachment = new Discord.MessageAttachment(data, "profile.png");

  channel.send({
    embeds: [],
    files: [attachment],
  });
}
