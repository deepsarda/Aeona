const Logging = require("../../database/schemas/logging.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "ban",
  description: "Ban a user from the server",
  usage: "+ban [@user] [reason]",
  category: "moderation",
  requiredArgs: 1,
  permissions: ["BAN_MEMBERS"],
  botPermissions: ["BAN_MEMBERS"],
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
      return message.channel.sendError({
        title: "Ban",
        description: "Please provide a user to ban.",
      });
    if (member.id === message.author.id)
      return message.channel.sendError({
        title: "Ban",
        description: "You cannot ban yourself.",
      });
    if (member.id === message.guild.ownerID)
      return message.channel.sendError({
        title: "Ban",
        description: "You cannot ban the server owner.",
      });
    if (message.member.roles.highest.position <= member.roles.highest.position)
      return message.channel.sendError({
        title: "Ban",
        description:
          "You cannot ban a user that has a role higher than your highest role.",
      });
    if (
      message.guild.me.roles.highest.position <= member.roles.highest.position
    )
      return message.channel.sendError({
        title: "Ban",
        description:
          "I cannot ban a user that has a role higher than my highest role.",
      });

    if (!member.bannable)
      return message.channel.sendError({
        title: "Ban",
        description: "I cannot ban this user.",
      });

    let dmEmbed;
    if (
      logging &&
      logging.moderation.ban_action &&
      logging.moderation.ban_message.toggle === "false" &&
      logging.moderation.ban_action !== "1"
    ) {
      if (logging.moderation.ban_action === "2") {
        dmEmbed = `You've been banned in **${message.guild.name}**`;
      } else if (logging.moderation.ban_action === "3") {
        dmEmbed = `You've been banned in **${message.guild.name}**\n\n__**Reason:**__ ${reason}`;
      } else if (logging.moderation.ban_action === "4") {
        dmEmbed = `You've been banned in **${message.guild.name}**\n\n__**Moderator:**__ ${message.author} **(${message.author.tag})**\n__**Reason:**__ ${reason}`;
      }

      member
        .sendError({
          title: "Ban",
          description: dmEmbed,
        })
        .catch(() => {});
    }

    if (
      logging &&
      logging.moderation.ban_message.toggle === "true" &&
      logging.moderation.ban_message.message
    ) {
      member
        .send(
          logging.moderation.ban_message.message
            .replace(/{user}/g, `${message.author}`)

            .replace(/{guildName}/g, `${message.guild.name}`)

            .replace(/{reason}/g, `${reason}`)

            .replace(/{userTag}/g, `${message.author.tag}`)

            .replace(/{userUsername}/g, `${message.author.username}`)

            .replace(/{userTag}/g, `${message.author.tag}`)

            .replace(/{userID}/g, `${message.author.id}`)

            .replace(/{guildID}/g, `${message.guild.id}`)

            .replace(/{guild}/g, `${message.guild.name}`)

            .replace(/{memberCount}/g, `${message.guild.memberCount}`)
        )
        .catch(() => {});
    }
    await member.ban({
      reason: `${reason} / Responsible user: ${message.author.tag}`,
    });

    message.channel
      .send({
        title: "Ban",
        description: `${member} has been banned. (${reason})`,
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
              if (logging.moderation.ban == "true") {
                let color = logging.moderation.color;
                if (color == "#000000")
                  color = message.guild.me.displayHexColor;

                let logcase = logging.moderation.caseN;
                if (!logcase) logcase = `1`;

                const logEmbed = new MessageEmbed()
                  .setAuthor(
                    `Action: \`Ban\` | ${member.tag} | Case #${logcase}`,
                    member.displayAvatarURL({ format: "png" })
                  )
                  .setDescription(
                    `**User:** ${member} \n**Reason:** ${reason} \n**Responsible Moderator:** ${message.author}`
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
