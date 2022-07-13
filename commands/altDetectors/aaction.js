const discord = require("discord.js");
const Guild = require("../../database/schemas/Guild");
const alt = require("../../database/schemas/altdetector.js");
module.exports = {
  name: "aaction",
  description: "Pick the action fired towards the alt.",
  permissions: ["MANAGE_GUILD"],
  usage: "+aaction <ban|kick|none>",
  category: "altDetectors",
  requiredArgs: 1,
  aliases: [],
  execute: async (message, args, bot, prefix) => {
    let choices = ["none", "kick", "ban"];

    if (!choices.includes(args[0].toLowerCase()))
      return await message.replyError({
        title: "Oops! That action doesn't exist!",
        description: `Please retry this command... using the correct command format.\n\n\`${prefix}aaction <ban|kick|none>\``,
      });

    let a = await alt.findOne({ guildId: message.guild.id });

    if (!a) {
      a = new alt({
        guildId: message.guild.id,
        altDays: 7,
        altModlog: "",
        allowedAlts: [],
        altAction: args[0].toLowerCase(),
        altToggle: false,
        notifier: false,
      });

      await a.save();

      return await message.reply({
        title: "Action successfully updated!",
        description: `The action was set to \`${args[0].toLowerCase()}\``,
      });
    }

    a.altAction = args[0].toLowerCase();
    await a.save();

    await message.reply({
      title: "Action successfully updated!",
      description: `The action was set to \`${args[0].toLowerCase()}\``,
    });
  },
};
