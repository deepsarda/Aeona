const Logging = require("../../database/schemas/logging.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "removerole",
  description: "Remove a role from the user",
  usage: "+removerole [@user] [role]",
  category: "moderation",
  requiredArgs: 2,
  permission: ["MANAGE_ROLES"],
  botPermission: ["MANAGE_ROLES"],
  execute: async (message, args, bot, prefix) => {
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
    let role =
      message.mentions.roles.first() ||
      (await message.guild.roles.fetch(args[1]));
    if (!role)
      return message.replyError({
        title: "Remove Role",
        description: "Please provide a role to remove from the user.",
      });

    if (!member)
      return message.replyError({
        title: "Remove Role",
        description: "Please provide a user to remmove the role from.",
      });

    if (member.id === message.author.id)
      return message.replyError({
        title: "Remove Role",
        description: "You cannot remove a role from yourself.",
      });

    if (member.id === message.guild.ownerID)
      return message.replyError({
        title: "Remove Role",
        description: "You cannot remove a role from the server owner.",
      });

    if (message.member.roles.highest.position <= role.position)
      return message.replyError({
        title: "Remove Role",
        description:
          "You cannot remove a role that is higher than your highest role.",
      });

    if (message.guild.me.roles.highest.position <= role.position)
      return message.replyError({
        title: "Remove Role",
        description:
          "I cannot remove a role that is higher than my highest role.",
      });

    if (
      message.guild.me.roles.highest.position <= member.roles.highest.position
    )
      return message.replyError({
        title: "Remove Role",
        description:
          "I cannot remove a role to that user as he has a role higher than my highest role.",
      });
    if (!member.roles.cache.has(role.id))
      return message.replyError({
        title: "Remove Role",
        description: "That user does not have that role.",
      });

    await member.roles.remove(role);
    let logging = await Logging.findOne({
      guildId: message.guild.id,
    });

    if (logging) {
      let ignorerole = message.guild.roles.cache.get(
        logging.moderation.ignore_role
      );
      const channel = message.guild.channels.cache.get(
        logging.moderation.channel
      );

      if (logging.moderation.delete_after_executed === "true") {
        message.delete().catch(() => {});
      }
      if (logging.moderation.toggle == "true") {
        if (channel) {
          if (message.channel.id !== logging.moderation.ignore_channel) {
            if (
              !ignorerole ||
              (ignorerole &&
                !message.member.roles.cache.find(
                  (r) => r.name.toLowerCase() === ignorerole.name
                ))
            ) {
              if (logging.moderation.role == "true") {
                let color = logging.moderation.color;
                if (color == "#000000")
                  color = message.guild.me.displayHexColor;

                let logcase = logging.moderation.caseN;
                if (!logcase) logcase = `1`;

                const logEmbed = new MessageEmbed()
                  .setAuthor(
                    `Action: \`Remove Role\` | ${member.user.tag} | Case #${logcase}`,
                    member.user.displayAvatarURL({ format: "png" })
                  )
                  .setDescription(
                    `**User:** ${member.user}\n**Role:** ${role}\n **Responsible Moderator:** ${message.author}`
                  )
                  .setFooter({ text: `ID: ${member.id}` })
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

    return message.reply({
      title: "Remove Role",
      description: `Successfully added the role ${role} to ${member}.`,
    });
  },
};
