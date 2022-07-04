const Guild = require("../../database/schemas/Guild");

module.exports = {
  name: "anti-invites",
  description: "Block Invites from the current server!",
  usage: "+anti-invites <enable | disable>",
  aliases: ["anti-invite", "antiinvite", "antiinvites"],
  category: "config",
  requiredArgs: 1,
  permission: ["MANAGE_GUILD"],
  execute: async (message, args, bot, prefix) => {
    const guild = await Guild.findOne({ guildId: message.guild.id });

    let option = args[0].toLowerCase();
    if (option === "enable") {
      guild.antiInvites = true;
      await guild.save();
      return message.reply({
        title: "Anti Invites",
        description: `Anti-invites has been enabled.`,
      });
    }

    if (option === "disable") {
      guild.antiInvites = false;
      await guild.save();
      return message.reply({
        title: "Anti Invites",
        description: `Anti-invites has been disabled.`,
      });
    }

    return message.replyError({
      title: "Anti Invites",
      description: `Please provide a valid argument. \n Valid arguments: \n enable \n disable`,
    });
  },
};
