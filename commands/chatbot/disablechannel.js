const Command = require("../../structures/Command");
const Guild = require("../../database/schemas/Guild");
const { MessageEmbed } = require("discord.js");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "disablechannel",
      aliases: [],
      description: "Disable a channel for the chatbot",
      category: "Chatbot",
      cooldown: 3,
      usage: "<channel>",
      userPermission: ["MANAGE_CHANNELS"],
    });
  }
  async run(message, args) {
    if (!args[0])
      return message.channel.send(`Please specify a channel to disable!`);
    const channel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.get(args[0]);
    if (!channel)
      return message.channel.send(`Please specify a valid channel!`);
    let guild = await Guild.findOne({
      guildId: message.guild.id,
    }).catch(() => {
      return message.channel.send(`An error occured while fetching the guild!`);
    });

    if (!guild) {
      guild = new Guild({
        guildId: message.guild.id,
        prefix: "+",
      });
    }

    if (guild.chatbot.disabledChannels.includes(channel.id)) {
      return message.channel.send(`That channel is already disabled!`);
    }

    guild.chatbot.disabledChannels.push(channel.id);
    await guild.save();
    message.channel.send(
      `Successfully disabled channel ${channel.name}! I will no longer reply to messages in this channel!`
    );

    return;
  }
};
