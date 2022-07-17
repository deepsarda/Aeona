const Guild = require("../../database/schemas/Guild");

module.exports = {
  name: "enablechannel",
  description: "Enable a channel for the chatbot to use",
  usage: "+enablechannel <channel>",
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

    if (!guild.chatbot.disabledChannels.includes(channel.id))
      return message.replyError({
        title: "Chatbot",
        description: `That channel is already enabled.`,
      });

    guild.chatbot.disabledChannels = guild.chatbot.disabledChannels.filter(
      (c) => c !== channel.id
    );

    await guild.save();

    return message.reply({
      title: "Chatbot",
      description: `Channel ${channel} has been enabled.`,
    });
  },
};
