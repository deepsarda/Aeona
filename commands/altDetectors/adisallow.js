const discord = require("discord.js");
const Guild = require("../../database/schemas/Guild");
const alt = require("../../database/schemas/altdetector.js");
module.exports = {
  name: "adisallow",
  description: "Remove a withlisted alt account of your choice.",
  permissions: ["MANAGE_GUILD"],
  usage: "+adisallow <userId>",
  category: "altDetectors",
  requiredArgs: 1,
  aliases: [],
  execute: async (message, args, client, prefix) => {
    await alt.findOne({ guildID: message.guild.id }, async (err, db) => {
      if (!db) {
        let newGuild = new alt({
          guildID: message.guild.id,
          altDays: 7,
          altModlog: "",
          allowedAlts: [],
          altAction: "none",
          altToggle: false,
          notifier: false,
        });

        await newGuild.save();

        return await message.replyError({
          title: "Oops!",
          description: `There aren't any whitelisted alt accounts!`,
        });
      }
      if (!db.allowedAlts.includes(args[0]))
        return await message.replyError({
          title: "Oops!",
          description: "Looks like that user isn't whitelisted!",
        });

      let arr = db.allowedAlts;
      let newArr = removeA(arr, args[0]);

      await db.updateOne({
        allowedAlts: newArr,
      });

      await message.reply({
        title: "Alt account removed!",
        description: `${args[0]} was successfully removed from the whitelist.`,
      });

      function removeA(arr) {
        let what,
          a = arguments,
          L = a.length,
          ax;
        while (L > 1 && arr.length) {
          what = a[--L];
          while ((ax = arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
          }
        }
        return arr;
      }
    });
  },
};
