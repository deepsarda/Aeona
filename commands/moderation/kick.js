const Logging = require("../../database/schemas/logging.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "kick",
  description: "Kick a user from the server",
  usage: "+kick [@user] [reason]",
  category: "moderation",
  requiredArgs: 1,
  permissions: ["KICK_MEMBERS"],
  botPermissions: ["KICK_MEMBERS"],
  execute: async (message, args, bot, prefix) => {
    let logging = await Logging.findOne({ guildId: message.guild.id });

    let member =
      message.mentions.members.first() &&
      message.mentions.members.filter(
        (m) => args[0] && args[0].includes(m.user.id)
      ).size >= 1
        ? message.mentions.members
            .filter((m) => args[0] && args[0].includes(m.user.id))
            .first()
        : false ||
          message.guild.members.cache.get(args[0]) ||
          (args.length > 0 &&
            message.guild.members.cache.find((m) =>
              m.user.username
                .toLowerCase()
                .includes(args.join(" ").toLowerCase())
            )) ||
          undefined;

    let reason = args.slice(1).join(" ");
    if (!reason) reason = "No reason provided.";
    if (reason.length > 1024) reason = reason.slice(0, 1021) + "...";

    if (!member)
      return message.replyError({
        title: "Kick",
        description: "Please provide a user to kick.",
      });
    if (member.id === message.author.id)
      return message.replyError({
        title: "Kick",
        description: "You cannot kick yourself.",
      });
    if (member.id === message.guild.ownerID)
      return message.replyError({
        title: "Kick",
        description: "You cannot kick the server owner.",
      });
    if (message.member.roles.highest.position <= member.roles.highest.position)
      return message.replyError({
        title: "Kick",
        description:
          "You cannot kick a user that has a role higher than your highest role.",
      });
    if (
      message.guild.me.roles.highest.position <= member.roles.highest.position
    )
      return message.replyError({
        title: "Kick",
        description:
          "I cannot kick a user that has a role higher than my highest role.",
      });

    if (!member.kickable)
      return message.replyError({
        title: "Kick",
        description: "I cannot kick this user.",
      });

    await member.kick(`${reason} / Responsible user: ${message.author.tag}`);

    message.channel
      .send({
        title: "Kick",
        description: `${member} has been kicked. (${reason})`,
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
              if (logging.moderation.kick == "true") {
                let color = logging.moderation.color;
                if (color == "#000000")
                  color = message.guild.me.displayHexColor;

                let logcase = logging.moderation.caseN;
                if (!logcase) logcase = `1`;

                const logEmbed = new MessageEmbed()
                  .setAuthor(
                    `Action: \`Kick\` | ${member.tag} | Case #${logcase}`,
                    member.displayAvatarURL({ format: "png" })
                  )
                  .setDescription(
                    `**User:** ${member}\n **Reason:** ${reason}\n **Responsible Moderator:** ${message.author.tag}`
                  )
                  .setFooter({ text: `ID: ${member.id}` })
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
