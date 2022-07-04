const discord = require("discord.js");
const Guild = require("../../database/schemas/Guild");
const alt = require("../../database/schemas/altdetector.js");
module.exports = {
  name: "aaction",
  description: "Pick the action fired towards the alt.",
  permissions: ["MANAGE_GUILD"],
  usage: "+aaction <ban | kick | none>",
  category: "altDetectors",
  requiredArgs: 1,
  aliases: [],
  execute: async (message, args, bot, prefix) => {
    let choices = ["none", "kick", "ban"];

    if (!choices.includes(args[0].toLowerCase()))
      return message.replyError({
        title: "Error",
        description: "Invalid action. Valid actions are: `none`, `kick`, `ban`",
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

      return message.reply({
        title: "Alt Detector",
        description: `Action set to ${args[0].toLowerCase()}`,
      });
    }

    a.altAction = args[0].toLowerCase();
    await a.save();

    return message.reply({
      title: "Alt Detector",
      description: `Action set to ${args[0].toLowerCase()}`,
    });
  },
};
