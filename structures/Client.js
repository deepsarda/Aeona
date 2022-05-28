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
      (this.commands = new Collection());
    this.catergories = new Collection();
    this.events = new Collection();
    this.mongoose = require("../utils/mongoose");
  }

  async start(token) {
    this.loadCommands();
    if (!process.env.DEV) this.loadEvents()

    this.mongoose.init();
    await this.login(token);
  }

  loadCommands() {
    let commands = this.loadFiles("./commands");
    for (let command of commands) {
      try {
        command = require("." + command);
        let category = command.category;
        if (!this.catergories.has(category)) {
          this.catergories.set(category, []);
        }
        this.catergories.get(category).push(command);

        this.commands.set(command.name, command);

        if (command.aliases) {
          for (let alias of command.aliases) {
            this.commands.set(alias, command);
          }
        }

        console.log(`Loaded command ${command.name}`);
      } catch (e) {
        console.error(e);
        console.log(`${command} failed to load`);
      }
    }
  }

  loadEvents() {
    let events = this.loadFiles("./events");

    for (let event of events) {
      try {
        event = require("." + event);
        this.events.set(event.name, event.execute);
        this.on(event.name, event.execute);

        console.log(`Loaded event ${event.name}`);
      } catch (e) {
        console.error(e);
        console.log(`Failed to load event ${event.name}`);
      }
    }
  }

  loadFiles(dir) {
    let filesPath = [];
    const files = fs.readdirSync(dir);
    for (const file of files) {
      //Check if the file is a directory
      const stat = fs.statSync(`${dir}/${file}`);
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