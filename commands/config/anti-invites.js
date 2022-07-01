const Guild = require("../../database/schemas/Guild");
const Afk = require("../../database/schemas/afk");


module.exports = {
  name: "anti-invites",
  description: "Block Invites from the current server!",
  usage: "+anti-invites <enable | disable>",
  aliases: ["anti-invite", "antiinvite", "antiinvites"],
  category: "config",
  requiredArgs: 1,
  permission:["MANAGE_GUILD"],
  execute: async (message, args, bot, prefix) => {
     const guild = await Guild.findOne({ guildId: message.guild.id });
  }
}