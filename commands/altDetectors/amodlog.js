const discord = require("discord.js");
const Guild = require("../../database/schemas/Guild");
const alt = require("../../database/schemas/altdetector.js");
module.exports = {
  name: "amodlog",
  description: "Set the channel in which logs will be sent.",
  permissions: ["MANAGE_GUILD"],
  usage: "+amodlog <channel>",
  category: "altDetectors",
  requiredArgs: 1,
  aliases: [],
  execute: async (message, args, client, prefix) => {
    let channel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.find((ch) => ch.name === args[0]) ||
      message.guild.channels.cache.get(args[0]);
    if (!channel)
      return await message.reply({
        title: "Oops!",
        description: `We couldn't find the channel: ${args[0]}`,
      });

    await alt.findOne({ guildID: message.guild.id }, async (err, db) => {
      if (!db) {
        let newGuild = new alt({
          guildID: message.guild.id,
          altDays: 7,
          altModlog: channel.id,
          allowedAlts: [],
          altAction: "none",
          altToggle: false,
          notifier: false,
        });

        await newGuild.save();

        return await message.reply({
          title: "Modlog channel set!",
          description: `The alt account modlog has been set to ${channel}.`,
        });
      }

      await db.updateOne({
        altModlog: channel.id,
      });

      return await message.reply({
        title: "Modlog channel set!",
        description: `The alt account modlog has been set to ${channel}.`,
      });
    });
  },
};
