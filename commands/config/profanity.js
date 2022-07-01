const Guild = require("../../database/schemas/Guild");

module.exports = {
  name: "profanity",
  description: "Stop user's from using profanity",
  usage: "+profanity <enable | disable>",
  category: "config",
  requiredArgs: 1,
  aliases: [],
  permission:["MANAGE_GUILD"],
  execute: async (message, args, bot, prefix) => {
    const guild = await Guild.findOne({ guildId: message.guild.id });

    if (guild.isPremium === "false")
      return message.channel.sendError({
        title: "Config",
        description: `This server is not premium. You can't use this command. \n Check out aeona premium [here](https://www.aeona.xyz/premium).`,
      });

    if (args[0] === "enable") {
      guild.aiAutoMod = true;
      await guild.save();
      return message.channel.send({
        title: "Config",
        description: `Profanity has been enabled.`,
      });
    }

    if (args[0] === "disable") {
      guild.aiAutoMod = false;
      await guild.save();
      return message.channel.send({
        title: "Config",
        description: `Profanity has been disabled.`,
      });
    }

    return message.channel.sendError({
      title: "Config",
      description: `Please provide a valid argument. \n Valid arguments: \n enable \n disable`,
    });
  },
};
