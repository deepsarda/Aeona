const { Client, Collection, MessageEmbed } = require("discord.js");
const fs = require("fs");

module.exports = class AeonaClient extends Client {
  constructor(options = {}, sentry) {
    super({
      partials: ["MESSAGE", "CHANNEL", "REACTION", "GUILD_MEMBER", "USER"],
      cacheGuilds: true,
      cacheChannels: true,
      cacheOverwrites: false,
      cacheRoles: true,
      cacheEmojis: true,
      cachePresences: false,
      fetchAllMembers: true,
      disableMentions: "everyone",
      messageCacheMaxSize: 25,
      messageCacheLifetime: 10000,
      shardCount: 1,
      intents: [
        "GUILDS",
        "GUILD_MEMBERS",
        "GUILD_BANS",
        "GUILD_EMOJIS_AND_STICKERS",
        "GUILD_INTEGRATIONS",
        "GUILD_WEBHOOKS",
        "GUILD_INVITES",
        "GUILD_VOICE_STATES",
        "GUILD_MESSAGES",
        "GUILD_MESSAGE_REACTIONS",
        "GUILD_MESSAGE_TYPING",
        "DIRECT_MESSAGES",
        "DIRECT_MESSAGE_REACTIONS",
        "DIRECT_MESSAGE_TYPING",
      ],
    });

    (this.partials = [
      "MESSAGE",
      "CHANNEL",
      "REACTION",
      "GUILD_MEMBER",
      "USER",
    ]),
      (this.commandsCache = new Collection());
    this.catergories = new Collection();
    this.events = new Collection();
    this.mongoose = require("../utils/mongoose");
  }

  async start(token) {
    this.loadCommands();
    if (!process.env.DEV) this.loadEvents().catch((e) => console.log(e));

    this.mongoose.init();
    await this.login(token);
  }

  async loadCommands() {}

  async loadEvents() {
    let events = await this.loadFiles("../events");
    for (const event of events) {
      this.events.set(event.name, event.event);
      this.on(event.name, event.event);
    }
  } 

  async loadFiles(dir) {
    let filesPath=[];
    const files = await fs.readdir(dir);
    for (const file of files) {
      //Check if the file is a directory
      const stat = await fs.stat(`${dir}/${file}`);
      if (stat.isDirectory()) {
        filesPath.push(...this.loadFiles(`${dir}/${file}`));
      } else {
        if (file.endsWith(".js")) {
          filesPath.push(`${dir}/${file}`);
        }
      }
    }

    return filesPath;
  }
};
