const customCommand = require("../../database/schemas/customCommand.js");
const Guild = require("../../database/schemas/Guild");

module.exports = {
  name: "createcommand",
  description: "Create a custom command",
  usage: "+createcommand <name> <response>",
  category: "config",
  requiredArgs: 2,
  aliases: ["cc", "customcommand"],
  permission: ["MANAGE_GUILD"],
  execute: async (message, args, bot, prefix) => {
    const guild = await Guild.findOne({ guildId: message.guild.id });
    let name = args[0].toLowerCase();
    let content = args.slice(1).join(" ");

    if (guild.isPremium === "false") {
      const results = await customCommand.find({ guildId: message.guild.id });
      if (results.length >= 5) {
        return await message.replyError({
          title: "Oops!",
          description: `Non-premium guilds can only have upto 5 custom commands! Get [premium to add more!](${process.env.domain}/premium)`,
        });
      }
    }

    if (name.length > 30) {
      return await message.replyError({
        title: "Oops!",
        description:
          "The name of the custom command cannot be longer than 30 characters!\nPlease retry this command.",
      });
    }

    if (content.length > 2000) {
      return await message.replyError({
        title: "Oops!",
        description:
          "The response to the custom command cannot be longer than 2000 characters!\nPlease retry this command.",
      });
    }

    let customCommand = await customCommand.findOne({
      guildId: message.guild.id,
      name: name,
    });

    if (customCommand)
      return await message.replyError({
        title: "Oops!",
        description:
          "Looks like an custom command with this name already exists!\nPlease retry this command.",
      });

    await customCommand.create({
      guildId: message.guild.id,
      name: name,
      content: content,
    });

    return message.reply({
      title: "Custom Command",
      description: `Custom command \`${name}\` has been created. \n\n Delete it with \`${prefix}deletecommand  ${name}\`.`,
    });
    await message.reply({
      title: "Custom command successfully created!",
      description: `A custom comand \`${name}\` has been created!\n\nYou can delete it using \`${prefix}deletecommand ${name}\`.`,
    });
  },
};
