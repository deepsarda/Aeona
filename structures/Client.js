const { Client, Collection, MessageEmbed } = require("discord.js");
const fs = require("fs");
const MusicManager = require("./MusicManager");
const { Structure } = require("erela.js");
const Discord = require("discord.js");
const Statcord = require("statcord.js");
const { SapphireClient } = require("@sapphire/framework");
const GuildSchema=require("../database/schemas/Guild");
// This system from discord music bot https://github.com/SudhanPlayz

Structure.extend(
  "Player",
  (Player) =>
    class extends Player {
      /**
       * Sets now playing message for deleting next time
       * @param {Message} message
       */
      setNowplayingMessage(message) {
        if (this.nowPlayingMessage && !this.nowPlayingMessage.deleted)
          this.nowPlayingMessage.delete();
        return (this.nowPlayingMessage = message);
      }
    }
);
module.exports = class AeonaClient extends SapphireClient {
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
      defaultPrefix: "+",
      caseInsensitiveCommands: true,
      typing:true,
      fetchPrefix:(message)=>{
        return "+"
      }
    });

    (this.partials = [
      "MESSAGE",
      "CHANNEL",
      "REACTION",
      "GUILD_MEMBER",
      "USER",
    ]),
    this.manager = new MusicManager(this);
    this.mongoose = require("../utils/mongoose");
    this.emojies = {
      mute: "🔇",
      volumemiddle: "🔉",
      volumelow: "🔈",
      volumehigh: "🔊",
      stop: "⏹️",
      skip: "⏭️",
      shuffle: "🔀",
      rewind: "⏪",
      resume: "▶️",
      remove: "⏏️",
      queue: "🎶",
      playlist: "🎶",
      play: "▶️",
      pause: "⏸️",
      loop: "🔁",
      forward: "⏩",
      filter: "🎛️",
      autoplay: "🎵",
      addsong: "🎵",
      music: "🎵",
      warn: "⚠️",
      join: "📥",
      leave: "📤",
      about: "🔎",
      jump: "⏭️",
    };
    this.emoji = this.emojies;

    this.statcord = new Statcord.Client({
      key: process.env.STATCORD,
      client: this,
    });
  }

  async start(token) {
    this.loadMusic();

    this.mongoose.init();
    await this.login(token);
  }

  loadMusic() {
    let events = this.loadFiles("./music");

    for (let event of events) {
      try {
        event = require("." + event);

        
          this.manager.on(event.name, event.execute.bind(null, this));

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
