const Guild = require("../../database/schemas/Guild");

module.exports = {
  name: "alwaysonchannel",
  description: "Set a channel to have Aeona reply to every message",
  usage: "+alwaysonchannel <channel>",
  category: "Chatbot",
  requiredArgs: 1,
  aliases: [],
  execute: async (message, args, bot, prefix) => {
    const channel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.get(args[0]);

    if (!channel)
      return message.replyError({
        title: "Chatbot",
        description: `Please provide a valid channel.`,
      });

    const guild = await Guild.findOne({ guildId: message.guild.id });

    guild.chatbot.alwaysOnChannel = channel.id;

    await guild.save();

    return message.reply({
      title: "Chatbot",
      description: `Always on channel set to ${channel}`,
    });
  },
};
