const Command = require("../../structures/Command");
const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
const Guild = require("../../database/schemas/Guild");
const PROTOCOL_REGEX = /^[a-zA-Z]+:\/\//;
const PATH_REGEX = /(\/(.+)?)/g;
const ReactionMenu = require("../../data/ReactionMenu.js");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "members",
      description: "Check all members of a certain role! or maybe all!",
      category: "Information",
      usage: "all | role name | @role",
      cooldown: 3,
      botPermission: ["ADD_REACTIONS"],
    });
  }

  async run(message, args) {
    let client = message.client;

    const guildDB = await Guild.findOne({
      guildId: message.guild.id,
    });

    const language = require(`../../data/language/${guildDB.language}.json`);

    return message.channel.send(
      "Check https://aeona.xyz/" + message.guild.id + "/members"
    );
  }
};
