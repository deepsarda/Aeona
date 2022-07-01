const customCommand = require("../../database/schemas/customCommand.js");
const Guild = require("../../database/schemas/Guild");

module.exports = {
  name: "createcommand",
  description: "Create a custom command",
  usage: "+createcommand <command name> <command description>",
  category: "config",
  aliases: ["cc", "customcommand"],
  permission: ["MANAGE_GUILD"],
  execute: async (message, args, bot, prefix) => {
    const guild = await Guild.findOne({ guildId: message.guild.id });
    let name = args[0].toLowerCase();
    let content = args.slice(1).join(" ");

    if (guild.isPremium === "false") {
      const results = await customCommand.find({ guildId: message.guild.id });
      if (results.length >= 5) {
        return message.channel.sendError({
          title: "Error",
          description:
            `Non premium guilds can only have 5 custom commands! Get [premium to add more!](${process.env.domain}/premium)`,
        });
      }
    }

    if (name.length > 30) {
      return message.channel.sendError({
        title: "Custom Command",
        description:
          "The name of the custom command cannot be longer than 30 characters.",
      });
    }

    if (content.length > 2000) {
      return message.channel.sendError({
        title: "Custom Command",
        description:
          "The content of the custom command cannot be longer than 2000 characters.",
      });
    }

    let customCommand = await customCommand.findOne({
      guildId: message.guild.id,
      name: name,
    });

    if (customCommand)
      return message.channel.sendError({
        title: "Custom Command",
        description: "A custom command with this name already exists.",
      });

    await customCommand.create({
      guildId: message.guild.id,
      name: name,
      content: content,
    });

    return message.channel.send({
      title: "Custom Command",
      description: `Custom command \`${name}\` has been created. \n\n Delete it with \`${prefix}deletecommand  ${name}\`.`,
    });
  },
};
