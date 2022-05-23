const resources = require("../utils/resources");
const Discord = require("discord.js");
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.random() * (max - min) + min; //The maximum is exclusive and the minimum is inclusive
}

module.exports = class commandInteraction {
  constructor(message, command) {
    
    this.message = message;
    this.bot = message.client;
    this.command = command;
    this.emotes = resources.emotes;
  }

  async success(options) {
    if (
      getRandomInt(0, 100) < 5 &&
      this.command.name != "help" &&
      this.command.name != "sendupdatemessage"
    ) {
      if (options.components) {
        options.components.push(
          new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton()
              .setLabel("Invite")
              .setURL(
                "https://discord.com/api/oauth2/authorize?client_id=931226824753700934&permissions=8&scope=applications.commands%20bot"
              )
              .setStyle("LINK"),
            new Discord.MessageButton()
              .setLabel("Support Server")
              .setURL("https://discord.gg/YKwf9B39fT")
              .setStyle("LINK"),
            new Discord.MessageButton()
              .setLabel("Website/Dashboard")
              .setURL("https://aeona.repl.co")
              .setStyle("LINK"),
            new Discord.MessageButton()
              .setLabel("Vote")
              .setURL("https://top.gg/bot/931226824753700934/vote")
              .setStyle("LINK")
          )
        );
      } else {
        options.components = [
          new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton()
              .setLabel("Invite")
              .setURL(
                "https://discord.com/api/oauth2/authorize?client_id=931226824753700934&permissions=8&scope=applications.commands%20bot"
              )
              .setStyle("LINK"),
            new Discord.MessageButton()
              .setLabel("Support Server")
              .setURL("https://discord.gg/YKwf9B39fT")
              .setStyle("LINK"),
            new Discord.MessageButton()
              .setLabel("Website/Dashboard")
              .setURL("https://aeona.repl.co")
              .setStyle("LINK"),
            new Discord.MessageButton()
              .setLabel("Vote")
              .setURL("https://top.gg/bot/870239976690970625/vote")
              .setStyle("LINK")
          ),
        ];
      }
    }
    let m = await resources.success.embed(options);

    return m;
  }

  async error(options) {
    const ratelimits = this.bot.ratelimits.get(this.message.author.id) || {};
    ratelimits[this.command.name] = 0;
    this.bot.ratelimits.set(this.message.author.id, ratelimits);
    return await resources.error.embed(options);
  }

  async reply(options) {
    try {
      if (this.message.commandName) {
        return await this.message.editReply(options);
      }
      return await this.message.reply(options);
    } catch (e) {
      console.log(e);
    }
  }
};
