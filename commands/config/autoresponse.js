const Guild = require("../../database/schemas/Guild");
const autoResponse = require("../../database/schemas/autoResponse.js");
module.exports = {
  name: "autoresponse",
  description: "Create a auto Response which gets triggered without prefix!",
  usage: "+autoresponse <command> <reply>",
  aliases: ["ar", "aresponse"],
  category: "config",
  requiredArgs: 2,
  permission: ["MANAGE_GUILD"],
  execute: async (message, args, bot, prefix) => {
    const guild = await Guild.findOne({ guildId: message.guild.id });

    if (guild.isPremium === "false") {
      const results = await autoResponse.find({ guildId: message.guild.id });
      if (results.length >= 5) {
        return message.replyError({
          title: "Error",
          description: `Non premium guilds can only have 5 auto responses! Get [premium to add more!](${process.env.domain}/premium)`,
        });
      }
    }
    let name = args[0].toLowerCase();
    let reply = args.slice(1).join(" ");

    if (name.length > 30)
      return message.replyError({
        title: "Auto Response",
        description:
          "The name of the auto response cannot be longer than 30 characters.",
      });

    if (reply.length > 2000)
      return message.replyError({
        title: "Auto Response",
        description:
          "The reply of the auto response cannot be longer than 2000 characters.",
      });

    let autoResponse = await autoResponse.findOne({
      guildId: message.guild.id,
      name: name,
    });

    if (autoResponse)
      return message.replyError({
        title: "Auto Response",
        description: "An auto response with this name already exists.",
      });

    await autoResponse.create({
      guildId: message.guild.id,
      name: name,
      content: reply,
    });

    return message.reply({
      title: "Auto Response",
      description: `Auto response \`${name}\` has been created. \n\n Delete it with \`${prefix}delete-autoresponse ${name}\`.`,
    });
  },
};
