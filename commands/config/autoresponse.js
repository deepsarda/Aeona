const Guild = require("../../database/schemas/Guild");
const autoResponses = require("../../database/schemas/autoResponse.js");
module.exports = {
  name: "autoresponse",
  description: "Create a auto-response which gets triggered without prefix!",
  usage: "+autoresponse <message> <response>",
  aliases: ["ar", "aresponse", "aresponder", "autoresponder"],
  category: "config",
  requiredArgs: 2,
  permission: ["MANAGE_GUILD"],
  execute: async (message, args, bot, prefix) => {
    const guild = await Guild.findOne({ guildId: message.guild.id });

    if (guild.isPremium === "false") {
      const results = await autoResponses.find({ guildId: message.guild.id });
      if (results.length >= 5) {
        return await message.replyError({
          title: "Oops!",
          description: `Non-premium guilds can only have upto 5 auto-responders! Get [premium to add more!](${process.env.domain}/premium)`,
        });
      }
    }
    let name = args[0].toLowerCase();
    let reply = args.slice(1).join(" ");

    if (name.length > 30)
      return await message.replyError({
        title: "Oops!",
        description:
          "The message to respond to, cannot be longer than 30 characters!\nPlease retry this command.",
      });

    if (reply.length > 2000)
      return await message.replyError({
        title: "Oops!",
        description:
          "The auto-response cannot be longer than 2000 characters!\nPlease retry this command.",
      });

    let autoResponse = await autoResponses.findOne({
      guildId: message.guild.id,
      name: name,
    });

    if (autoResponse)
      return await message.replyError({
        title: "Oops!",
        description:
          "Looks like an auto-response for this message already exists!\nPlease retry this command.",
      });

    await autoResponses.create({
      guildId: message.guild.id,
      name: name,
      content: reply,
    });

    await message.reply({
      title: "Auto-responder successfully created!",
      description: `An auto-response for the message \`${name}\` has been created!\n\nYou can delete it using \`${prefix}delete-autoresponse ${name}\`.`,
    });
  },
};
