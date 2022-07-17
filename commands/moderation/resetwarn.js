const { MessageEmbed } = require("discord.js");
const warnModel = require("../../database/schemas/moderation.js");
const Logging = require("../../database/schemas/logging.js");

module.exports = {
  name: "resetwarn",
  description: "Reset all the warnings from a specific user",
  usage: "+resetwarn [@user] [Reason]",
  category: "moderation",
  requiredArgs: 1,
  permissions: ["MANAGE_MESSAGES"],
  botPermissions: ["MANAGE_MESSAGES"],
  execute: async (message, args, bot, prefix) => {
    let logging = await Logging.findOne({ guildId: message.guild.id });
    const mentionedMember =
      message.mentions.members.last() ||
      message.guild.members.cache.get(args[0]);
    if (!mentionedMember)
      return message.replyError({
        title: "Reset Warnings",
        description: "Please provide a user to reset warnings.",
      });

    const mentionedPotision = mentionedMember.roles.highest.position;
    const memberPotision = message.member.roles.highest.position;

    if (memberPotision <= mentionedPotision)
      return message.replyError({
        title: "Reset Warnings",
        description:
          "You cannot reset warnings of a user with a role higher than your highest role.",
      });

    let reason = args.slice(1).join(" ");
    if (!reason) reason = "No reason provided.";
    if (reason.length > 1024) reason = reason.slice(0, 1021) + "...";
    const warnDoc = await warnModel.findOne({
      guildID: message.guild.id,
      memberID: mentionedMember.id,
    });

    if (!warnDoc || !warnDoc.warnings.length)
      return message.replyError({
        title: "Reset Warnings",
        description: "That user does not have any warnings.",
      });

    await warnDoc.updateOne({
      modType: [],
      warnings: [],
      warningID: [],
      moderator: [],
      date: [],
    });

    message
      .reply({
        title: "Reset Warnings",
        description: `Successfully reset all warnings from ${mentionedMember}.`,
      })
      .then(async (s) => {
        if (logging && logging.moderation.delete_reply === "true") {
          setTimeout(() => {
            s.delete().catch(() => {});
          }, 5000);
        }
      });

    if (logging) {
      if (logging.moderation.delete_after_executed === "true") {
        message.delete().catch(() => {});
      }

      const role = message.guild.roles.cache.get(
        logging.moderation.ignore_role
      );
      const channel = message.guild.channels.cache.get(
        logging.moderation.channel
      );

      if (logging.moderation.toggle == "true") {
        if (channel) {
          if (message.channel.id !== logging.moderation.ignore_channel) {
            if (
              !role ||
              (role &&
                !message.member.roles.cache.find(
                  (r) => r.name.toLowerCase() === role.name
                ))
            ) {
              if (logging.moderation.warns == "true") {
                let color = logging.moderation.color;
                if (color == "#000000")
                  color = message.guild.me.displayHexColor;

                let logcase = logging.moderation.caseN;
                if (!logcase) logcase = `1`;

                const logEmbed = new MessageEmbed()
                  .setAuthor(
                    `Action: \`Clear Warn\` | ${mentionedMember.user.tag} | Case #${logcase}`,
                    mentionedMember.user.displayAvatarURL({ format: "png" })
                  )
                  .setDescription(
                    `**User:** ${mentionedMember.user}\n **Responsible Moderator:** ${message.author}\n **Reason:** ${reason}`
                  )
                  .setFooter({ text: `ID: ${mentionedMember.id}` })
                  .setTimestamp()
                  .setColor(color);

                channel.send({ embeds: [logEmbed] }).catch(() => {});

                logging.moderation.caseN = logcase + 1;
                await logging.save().catch(() => {});
              }
            }
          }
        }
      }
    }
  },
};
