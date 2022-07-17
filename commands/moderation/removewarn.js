const { MessageEmbed } = require("discord.js");
const warnModel = require("../../database/schemas/moderation.js");
const Logging = require("../../database/schemas/logging.js");

module.exports = {
  name: "removewarn",
  description: "Remove a warning from a user",
  usage: "+removewarn [@user] [id]",
  category: "moderation",
  requiredArgs: 2,
  permission: ["MANAGE_ROLES"],
  async execute(message, args, bot, prefix) {
    let logging = await Logging.findOne({ guildID: message.guild.id });

    const mentionedMember =
      message.mentions.members.last() ||
      message.guild.members.cache.get(args[0]);
    if (!mentionedMember)
      return message.replyError({
        title: "Remove Warning",
        description: "Please provide a user to remove the warning from.",
      });
    const mentionedPosition = mentionedMember.roles.highest.position;
    const memberPosition = message.member.roles.highest.position;

    if (memberPosition <= mentionedPosition)
      return message.replyError({
        title: "Remove Warning",
        description:
          "You cannot remove a warning from someone with a higher role.",
      });
    let reason = args.slice(2).join(" ");
    if (!reason) reason = language.softbanNoReason;
    if (reason.length > 1024) reason = reason.slice(0, 1021) + "...";

    const warnDoc = await warnModel
      .findOne({
        guildID: message.guild.id,
        memberID: mentionedMember.id,
      })
      .catch((err) => console.log(err));

    if (!warnDoc || !warnDoc.warnings.length)
      return message.replyError({
        title: "Remove Warning",
        description: "That user does not have any warnings.",
      });

    let warningID = args[1];
    if (!warningID)
      return message.replyError({
        title: "Remove Warning",
        description: "Please provide an warning ID to remove.",
      });

    let check = warnDoc.warningID.filter((word) => args[1] === word);

    if (!warnDoc.warningID.includes(warningID))
      return message.replyError({
        title: "Remove Warning",
        description: "That warning ID does not exist.",
      });

    if (!check)
      return message.replyError({
        title: "Remove Warning",
        description: "That warning ID does not exist.",
      });

    if (check.length < 0)
      return message.replyError({
        title: "Remove Warning",
        description: "That warning ID does not exist.",
      });

    let toReset = warnDoc.warningID.length;

    warnDoc.warnings.splice(toReset - 1, toReset !== 1 ? toReset - 1 : 1);
    warnDoc.warningID.splice(toReset - 1, toReset !== 1 ? toReset - 1 : 1);
    warnDoc.modType.splice(toReset - 1, toReset !== 1 ? toReset - 1 : 1);
    warnDoc.moderator.splice(toReset - 1, toReset !== 1 ? toReset - 1 : 1);
    warnDoc.date.splice(toReset - 1, toReset !== 1 ? toReset - 1 : 1);

    await warnDoc.save().catch((err) => console.log(err));

    message
      .reply({
        title: "Remove Warning",
        description: `Successfully removed warning ${warningID} from ${mentionedMember.user.tag}`,
      })
      .then(async (s) => {
        if (logging && logging.moderation.delete_reply === "true") {
          setTimeout(() => {
            s.delete().catch(() => {});
          }, 5000);
        }
      })
      .catch(() => {});

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
                    `Action: \`Remove Warn\` | ${mentionedMember.user.tag} | Case #${logcase}`,
                    mentionedMember.user.displayAvatarURL({ format: "png" })
                  )
                  .setDescription(
                    `**User:** ${mentionedMember} \n **Responsible Moderator:** ${message.author} \n **Reason:** ${reason}`
                  )
                  .setFooter({
                    text: `ID: ${mentionedMember.id} | Warn ID: ${warningID}`,
                  })
                  .setTimestamp()
                  .setColor(color);

                channel.send({ embeds: [logEmbed] }).catch((e) => {
                  console.log(e);
                });

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
