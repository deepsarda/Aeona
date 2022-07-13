const discord = require("discord.js");
const Guild = require("../../database/schemas/Guild");
const alt = require("../../database/schemas/altdetector.js");
module.exports = {
  name: "asetdays",
  description: "Set the amount of days of the alt age.",
  permissions: ["MANAGE_GUILD"],
  usage: "+asetdays <number of days>",
  category: "altDetectors",
  requiredArgs: 1,
  aliases: [],
  execute: async (message, args, client, prefix) => {
    let days = Number(args[0]);
    if (isNaN(days))
      return await message.replyError({
        title: "Oops!",
        description:
          "The number of days you entered was invalid.\nPlease retry this command... entering a number.",
      });

    let day = Number(days);

    if (day > 100)
      return await message.replyError({
        title: "Oops!",
        description:
          "The number of days you entered was invalid.\nPlease retry this command... entering a number less than or equal to 100.",
      });

    await alt.findOne(
      {
        guildID: message.guild.id,
      },
      async (err, db) => {
        if (!db) {
          let newGuild = new alt({
            guildID: message.guild.id,
            altDays: days,
            altModlog: "",
            allowedAlts: [],
            altAction: "none",
            altToggle: false,
            notifier: false,
          });

          await newGuild.save().catch((err) => {
            console.log(err);
          });

          return await message.reply({
            title: "Alt age blocker set!",
            description: `The alt-detector will now automatically block accounts younger than ${days} days.`,
          });
        }

        await db.updateOne({
          altDays: day,
        });

        await message.reply({
          title: "Alt age blocker set!",
          description: `The alt-detector will now automatically block accounts younger than ${days} days.`,
        });
      }
    );
  },
};
