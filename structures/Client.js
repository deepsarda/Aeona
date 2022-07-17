const { Client, Collection, MessageEmbed } = require("discord.js");
const fs = require("fs");
const MusicManager = require("./MusicManager");
const { Structure } = require("erela.js");
const Discord = require("discord.js");
const Statcord = require("statcord.js");
const config = require("../utils/config");
const data=require("../data");
const Tenor = require("tenorjs").client({
  Key: "LIVDSRZULELA", // https://tenor.com/developer/keyregistration
  Filter: "low", // "off", "low", "medium", "high", not case sensitive
  Locale: "en_US", // Your locale here, case-sensitivity depends on input
  MediaFilter: "minimal", // either minimal or basic, not case sensitive
  DateFormat: "D/MM/YYYY - H:mm:ss A", // Change this accordingly
});

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
module.exports = class AeonaClient extends Client {
  constructor(options = {}, sentry) {
    super({
      ws: { properties: { $browser: "Discord iOS" } },
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
    this.manager = new MusicManager(this);
    this.categories = new Collection();
    this.events = new Collection();
    this.mongoose = require("../utils/mongoose");

    this.emojies=data.music;
    this.emoji = this.emojies;

    this.statcord = new Statcord.Client({
      key: process.env.STATCORD,
      client: this,
    });
    this.emotes = {
      left: "<:left:907825540927471627>",
      right: "<:right:907828453859028992>",
    };
    require("../handlers/economy").run(this);
    this.developers = config.developers;
    this.giveawaysManager = require("../utils/giveaways")(this);

    this.version=require("../package.json").version;

    this.updateLog={
      "v7.0.0":{
        content:`<a:heart_fireworks:852185600320339968> Hey there! Aeona just received a **MASSIVE** update!

        __❗Aeona **v7 update** Changelog! __
        > <:00c_do:998136841339408404> **New** website design
        > <:00c_do:998136841339408404> Major AI improvements
        > <:00c_do:998136841339408404> **Added a new module:** Giveaways
        > <:00c_do:998136841339408404> **Added a new module:** Levels
        > <:00c_do:998136841339408404> **Added a new module:** Premium
        >  
        > <:x_dot:998137225688657970>*Item upgrade prices* are now **1/10th** of the previous cost!
        > <:x_dot:998137225688657970>Renamed the module \`Anime\` to \`Emote\`
        > <:x_dot:998137225688657970>Added 15 **new** image commands!
        > <:x_dot:998137225688657970>Added new **music** system, __auto-song recommendation__ and **24-7** music!
        > <:x_dot:998137225688657970>Reaction roles now support __custom emojis__
        
        And finally... all modules got **major bug fixes**!! <a:yayNezuko:998137494279290933>`
      }
    }
  }

  async start(token) {
    this.loadCommands();
    if (!process.env.DEV) this.loadEvents();

    this.mongoose.init();
    await this.login(token);
  }

  loadCommands() {
    let commands = this.loadFiles("./commands");
    for (let command of commands) {
      try {
        let info = false;
        if (command.includes("_info.js")) info = true;
        command = require("." + command);
        let category = command.category.toLowerCase();
        if (!this.categories.has(category)) {
          this.categories.set(category, { info: null, commands: [] });
        }

        if (!info) {
          this.categories.get(category).commands.push(command);

          this.commands.set(command.name.toLowerCase(), command);

          if (command.aliases) {
            for (let alias of command.aliases) {
              this.commands.set(alias.toLowerCase(), command);
            }
          }
        } else {
          this.categories.get(category).info = command;
        }
      } catch (e) {
        console.error(e);
        console.log(`${command} failed to load`);
      }
    }

    //Watch for file changes
    const watcher = require("chokidar").watch("./commands", {
      ignored: /(^|[\/\\])\../,
      persistent: true,
    });
    let client = this;
    watcher.on("change", (path) => {
      console.log(`${path} changed`);
      delete require.cache[require.resolve("../" + path.replace("\\", "/"))];
      let command = require("../" + path.replace("\\", "/"));

      let info = false;
      if (path.includes("_info.js")) info = true;

      if (!info) {
        let category = command.category.toLowerCase();
        if (!client.categories.has(category)) {
          client.categories.set(category, { info: null, commands: [] });
        }

        for (
          let i = 0;
          i < client.categories.get(category).commands.length;
          i++
        ) {
          if (
            client.categories.get(category).commands[i].name === command.name
          ) {
            client.categories.get(category).commands.splice(i, 1);
            break;
          }
        }
        client.categories.get(category).commands.push(command);
        client.commands.set(command.name.toLowerCase(), command);
        if (command.aliases) {
          for (let alias of command.aliases) {
            client.commands.set(alias.toLowerCase(), command);
          }
        }
      } else {
        let category = command.category.toLowerCase();
        client.categories.get(category).info = command;
      }
    });

    console.log(`Loaded ${commands.length} commands`);
  }

  async getReaction(category) {
    let results = await Tenor.Search.Random("anime " + category, "1");
    return results[0].media[0].gif.url;
  }
  loadEvents() {
    let events = this.loadFiles("./events");

    for (let event of events) {
      try {
        let music = false;
        if (event.includes("music")) music = true;
        event = require("." + event);

        if (music) {
          this.manager.on(event.name, event.execute.bind(null, this));
        } else {
          this.events.set(event.name, event.execute);
          this.on(event.name, (...args) => event.execute(this, ...args));
        }
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
