const Command = require("../../structures/Command");
const Guild = require("../../database/schemas/Guild");
const { MessageEmbed } = require("discord.js");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "alwaysonchannel",
      aliases: ["alwayson", "aoc"],
      description: "Enable a channel for the chatbot",
      category: "Chatbot",
      cooldown: 3,
      usage: "<channel>",
      userPermission: ["MANAGE_CHANNELS"],
    });
  }
  async run(message, args) {
    if (!args[0])
      return message.channel.send(`Please specify a channel to enable!`);
    const channel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.get(args[0]);
    if (!channel)
      return message.channel.send(`Please specify a valid channel!`);
    let guild = await Guild.findOne({ guildId: message.guild.id });
    if (!guild) {
      guild = new Guild({
        guildId: message.guild.id,
        prefix: "+",
      });
    }
    if (guild.chatbot.alwaysOnChannel === channel.id) {
      return message.channel.send(`That channel is already enabled!`);
    }
    guild.chatbot.alwaysOnChannel = channel.id;
    await guild.save();
    message.channel.send(
      `Successfully enabled channel ${channel.name}! I will now reply to messages in this channel!`
    );
    return;
  }
};
