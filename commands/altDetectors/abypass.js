const discord = require("discord.js");
const Guild = require("../../database/schemas/Guild");
const alt = require("../../database/schemas/altdetector.js");
module.exports = {
  name: "abypass",
  description: "Whitelist alt accounts of your choice.",
  permissions: ["MANAGE_GUILD"],
  usage: "+abypass <userId>",
  category: "altDetectors",
  requiredArgs: 1,
  aliases: [],
  execute: async (message, args, client, prefix) => {
    const guildDB = await Guild.findOne({
      guildId: message.guild.id,
    });
    await client.users
      .fetch(args[0])
      .then((u) => {
        alt.findOne(
          {
            guildID: message.guild.id,
          },
          async (err, db) => {
            if (!db) {
              let newGuild = new alt({
                guildID: message.guild.id,
                altDays: 7,
                altModlog: "",
                allowedAlts: [args[0]],
                altAction: "none",
                altToggle: false,
                notifier: false,
              });

              await newGuild.save().catch((err) => {
                console.log(err);
              });
              return message.reply({
                title: "Alt Account Whitelisted",
                description: `${u.tag} has been whitelisted.`,
              });
            }

            let oldAllowedAlts = db.allowedAlts; //[]
            if (guildDB.isPremium === "false")
              if (oldAllowedAlts.length === 10)
                return message.replyError({
                  title: "Error",
                  description: `You have reached the maximum number of allowed alts. Please upgrade to [premium](${process.env.domain}/premium) to add more.`,
                });

            if (guildDB.isPremium === "true") {
              if (oldAllowedAlts.length === 50)
                return message.replyError({
                  title: "Error",
                  description: `You have reached the maximum number of allowed alts.`,
                });
            }
            oldAllowedAlts.push(u.id);

            await db.updateOne({
              allowedAlts: oldAllowedAlts,
            });

            message.reply({
              title: "Alt Account Whitelisted",
              description: `${u.tag} has been whitelisted.`,
            });
          }
        );
      })
      .catch((err) => {
        message.replyError({
          title: "Error",
          description: `${args[0]} is not a valid user id.`,
        });
      });
  },
};
