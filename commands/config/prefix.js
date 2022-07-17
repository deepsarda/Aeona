const Guild = require("../../database/schemas/Guild");

module.exports = {
  name: "prefix",
  description: "Change the bot's prefix",
  usage: "+prefix <new prefix>",
  category: "config",
  requiredArgs: 1,
  aliases: [],
  permission: ["MANAGE_GUILD"],
  execute: async (message, args, bot, prefix) => {
    let p = args[0];

    if (p.length > 5) 
      return await message.replyError({
        title: "Oops!",
        description:
          "The prefix cannot be longer than 5 characters!\nPlease retry this command.",
      });

    let guild = await Guild.findOne({
      guildId: message.guild.id,
    });

    guild.prefix = p;

    await guild.save();

    await message.reply({
      title: "Prefix updated!",
      description: `The prefix has successfully been changed to \`${p}\`.`,
    });
  },
};
