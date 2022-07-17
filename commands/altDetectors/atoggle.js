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
      return await message.replyError({
        title: "Oops! Invalid choice!",
        description: `Please retry this command... using the correct command format.\n\n\`${prefix}atoggle <true|false>\``,
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

        return await message.reply({
          title: "Alt-detector enabled!",
          description: `The alt-Detector was successfully enabled!\nIt will now automatically block accounts younger than 7 days.`,
        });
      }

      await db.updateOne({
        altToggle: args[0].toLowerCase(),
      });

      let choice;
      if (args[0].toLowerCase() === "true") {
        choice = "enabled";
      } else if (args[0].toLowerCase() === "false") {
        choice = "disabled";
      }

      return await message.reply({
        title: `Alt-detector ${choice}!`,
        description: `The alt-detector was successfully ${choice}.`,
      });
    });
  },
};
