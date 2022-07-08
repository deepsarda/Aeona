const Logging = require("../../database/schemas/logging.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "unban",
  description: "Unban a user from the server",
  usage: "+unban [user id] [reason]",
  category: "moderation",
  requiredArgs: 1,
  permissions: ["BAN_MEMBERS"],
  botPermissions: ["BAN_MEMBERS"],
  execute: async (message, args, bot, prefix) => {
    let logging = await Logging.findOne({ guildId: message.guild.id });

    let id = args[0];

    if (id.toLowerCase() === "all") {
      const users = await message.guild.fetchBans();
      const array = [];

      let reason = `Unban All`;

      for (const user of users.values()) {
        await message.guild.members.unban(
          user.user,
          `${reason} / Responsible Moderator: ${message.author.tag}`
        );
        array.push(user.user.tag);
      }

      if (!array || !array.length)
        return message.replyError({
          title: "Unban",
          description: "No users were unbanned.",
        });

      message
        .reply({
          title: "Unban",
          description: `Unbanned ${array.length} users. ${array.join(", ")}`,
        })
        .then(() => {
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
                if (logging.moderation.ban == "true") {
                  let color = logging.moderation.color;
                  if (color == "#000000")
                    color = message.guild.me.displayHexColor;

                  let logcase = logging.moderation.caseN;
                  if (!logcase) logcase = `1`;

                  let bannedUsersLength = `${array.length} users`;
                  if (!array || !array.length) bannedUsersLength = "No users";
                  if (array.length === 1) bannedUsersLength = "1 User";
                  const logEmbed = new MessageEmbed()
                    .setAuthor(
                      `Action: \`UnBan All\` | ${bannedUsersLength} | Case #${logcase}`,
                      message.author.displayAvatarURL({ format: "png" })
                    )
                    .setDescription(
                      `**Unbanned Users** ${array.join(
                        ", "
                      )} \n **Responsible Moderator** ${message.author}`
                    )
                    .setTimestamp()
                    .setColor(color);

                  if (array.length)
                    logEmbed.addField("**Users:**", array.join(" - "));
                  channel.send({ embeds: [logEmbed] }).catch(() => {});

                  logging.moderation.caseN = logcase + 1;
                  await logging.save().catch(() => {});
                }
              }
            }
          }
        }
      }

      return;
    }

    const bannedUsers = await message.guild.fetchBans();
    const user = bannedUsers.get(args[0]);
    if (!user)
      return message.replyError({
        title: "Unban",
        description: "User not found. Please check the ID.",
      });

    let reason = args.slice(1).join(" ");
    if (!reason) reason = "No reason provided";
    if (reason.length > 1024) reason = reason.slice(0, 1021) + "...";

    const userr = bannedUsers.get(id).user;
    await message.guild.members.unban(
      user.user,
      `${reason} / Responsible Moderator: ${message.author.tag}`
    );
    message
      .reply({
        title: "Unban",
        description: `Unbanned <@${user}>}`,
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
              !message.member.roles.cache.find(
                (r) => r.name.toLowerCase() === role.name
              )
            ) {
              if (logging.moderation.ban == "true") {
                let color = logging.moderation.color;
                if (color == "#000000")
                  color = message.guild.me.displayHexColor;

                let logcase = logging.moderation.caseN;
                if (!logcase) logcase = `1`;

                let reason = args.slice(1).join(" ");
                if (reason.length > 1024)
                  reason = reason.slice(0, 1021) + "...";

                const logEmbed = new MessageEmbed()
                  .setAuthor(
                    `Action: \`UnBan\` | ${userr.tag} | Case #${logcase}`,
                    userr.displayAvatarURL({ format: "png" })
                  )
                  .setDescription(
                    `**Unbanned User** ${userr} \n **Responsible Moderator** ${message.author} \n **Reason** ${reason}`
                  )

                  .setFooter({ text: `ID: ${userr.id}` })
                  .setTimestamp()
                  .setColor(color);

                channel.send(logEmbed).catch((e) => {
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
