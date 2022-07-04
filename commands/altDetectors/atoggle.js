const discord = require("discord.js");
const Guild = require("../../database/schemas/Guild");
const alt = require("../../database/schemas/altdetector.js");
module.exports = {
  name: "atoggle",
  description: "Disable or Enable the altdetector Module.",
  permissions: ["MANAGE_GUILD"],
  usage: "+atoggle <true|false>",
  category: "altDetectors",
  requiredArgs: 1,
  aliases: [],
  execute: async (message, args, client, prefix) => {
    let choices = ["true", "false"];
    if (!choices.includes(args[0].toLowerCase()))
      return message.replyError({
        title: "Error",
        description: "Invalid choice. Valid choices are: `true`, `false`",
      });

    await alt.findOne({ guildID: message.guild.id }, async (err, db) => {
      if (!db) {
        let newGuild = new alt({
          guildID: message.guild.id,
          altDays: 7 /*86400000*/,
          altModlog: "",
          allowedAlts: [],
          altAction: "none",
          altToggle: args[0].toLowerCase(),
          notifier: false,
        });

        await newGuild.save();

        return message.reply({
          title: "Alt Detector",
          description: `Alt Detector will now automatically block accounts younger than 7 days.`,
        });
      }

      await db.updateOne({
        altToggle: args[0].toLowerCase(),
      });

      let choice;
      if (args[0].toLowerCase() === "true") {
        choice = "on";
      } else if (args[0].toLowerCase() === "false") {
        choice = "off";
      }

      return message.reply({
        title: "Alt Detector",
        description: `Alt Detector is now ${choice}.`,
      });
    });
  },
};
