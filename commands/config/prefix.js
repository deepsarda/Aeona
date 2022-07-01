const Guild = require("../../database/schemas/Guild");

module.exports = {
  name: "prefix",
  description: "Change the bot's prefix",
  usage: "+prefix <new prefix>",
  category: "config",
  aliases: [],
  permission: ["MANAGE_GUILD"],
  execute: async (message, args, bot, prefix) => {
    let p = args[0];

    if (p.length > 5)
      return message.channel.sendError({
        title: "Prefix",
        description: "The prefix cannot be longer than 5 characters.",
      });

    let guild = await Guild.findOne({
      guildId: message.guild.id,
    });

    guild.prefix = p;

    await guild.save();

    return message.channel.send({
      title: "Prefix",
      description: "The prefix has been changed to `" + prefix + "`.",
    });
  },
};