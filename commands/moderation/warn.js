const { MessageEmbed } = require("discord.js");
const warnModel = require("../../database/schemas/moderation.js");
const Logging = require("../../database/schemas/logging.js");
const randoStrings = require("randostrings");
let random = new randoStrings();
module.exports = {
  name: "warn",
  description: "Warn a specific user from your server",
  usage: "+warn [@user] [reason]",
  category: "moderation",
  requiredArgs: 2,
  permissions: ["MANAGE_MESSAGES"],
  botPermissions: ["MANAGE_MESSAGES"],
  execute: async (message, args, bot, prefix) => {
    let logging = await Logging.findOne({ guildId: message.guild.id });
    const mentionedMember =
      message.mentions.members.last() ||
      message.guild.members.cache.get(args[0]);

    if (!mentionedMember)
      return message.replyError({
        title: "Warn",
        description: "Please provide a user to warn.",
      });

    const mentionedPotision = mentionedMember.roles.highest.position;
    const memberPotision = message.member.roles.highest.position;

    if (memberPotision <= mentionedPotision)
      return message.replyError({
        title: "Warn",
        description:
          "You cannot warn a user with a role higher than your highest role.",
      });
    const reason = args.slice(1).join(" ");

    let warnID = random.password({
      length: 8,
      string: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
    });

    let warnDoc = await warnModel
      .findOne({
        guildID: message.guild.id,
        memberID: mentionedMember.id,
      })
      .catch((err) => console.log(err));

    if (!warnDoc) {
      warnDoc = new warnModel({
        guildID: message.guild.id,
        memberID: mentionedMember.id,
        modAction: [],
        warnings: [],
        warningID: [],
        moderator: [],
        date: [],
      });

      await warnDoc.save().catch((err) => console.log(err));

      warnDoc = await warnModel.findOne({
        guildID: message.guild.id,
        memberID: mentionedMember.id,
      });
    }
    warnDoc.modType.push("warn");
    warnDoc.warnings.push(reason);
    warnDoc.warningID.push(warnID);
    warnDoc.moderator.push(message.member.id);
    warnDoc.date.push(Date.now());

    await warnDoc.save().catch((err) => console.log(err));
    let dmEmbed;
    if (
      logging &&
      logging.moderation.warn_action &&
      logging.moderation.warn_action !== "1"
    ) {
      if (logging.moderation.warn_action === "2") {
        dmEmbed = `You've been warned in **${message.guild.name}**`;
      } else if (logging.moderation.warn_action === "3") {
        dmEmbed = `You've been warned in **${message.guild.name}**\n\n__**Reason:**__ ${reason}`;
      } else if (logging.moderation.warn_action === "4") {
        dmEmbed = `You've been warned in **${message.guild.name}**\n\n__**Moderator:**__ ${message.author} **(${message.author.tag})**\n__**Reason:**__ ${reason}`;
      }

      mentionedMember
        .sendError({
          title: "Warn",
          description: dmEmbed,
        })
        .catch((err) => console.log(err));

      message
        .reply({
          title: "Warn",
          description: `Successfully warned ${mentionedMember}`,
        })
        .then(async (s) => {
          if (logging && logging.moderation.delete_reply === "true") {
            setTimeout(() => {
              s.delete().catch(() => {});
            }, 5000);
          }
        })
        .catch(() => {});

      if (logging && logging.moderation.auto_punish.toggle === "true") {
        if (
          Number(logging.moderation.auto_punish.amount) <=
          Number(warnDoc.warnings.length)
        ) {
          const punishment = logging.moderation.auto_punish.punishment;
          let action;

          if (punishment === "1") {
            action = `banned`;

            await mentionedMember
              .ban({
                reason: `Auto Punish / Responsible user: ${message.author.tag}`,
              })
              .catch(() => {});
          } else if (punishment === "2") {
            action = `kicked`;

            await mentionedMember
              .kick({
                reason: `Auto Punish / Responsible user: ${message.author.tag}`,
              })
              .catch(() => {});
          } else if (punishment === "3") {
            action = `softbanned`;

            await mentionedMember.ban({
              reason: `Auto Punish / Responsible user: ${message.author.tag}`,
              days: 7,
            });
            await message.guild.members.unban(
              mentionedMember.user,
              `Auto Punish / Responsible user: ${message.author.tag}`
            );
          }

          message.reply({
            title: "Warn",
            description: `Auto Punish triggered, ${action} **${mentionedMember.user.tag}**`,
          });

          const auto = logging.moderation.auto_punish;
          if (auto.dm && auto.dm !== "1") {
            let dmEmbed;
            if (auto.dm === "2") {
              dmEmbed = ` You've been ${action} from **${message.guild.name}**\n__(Auto Punish Triggered)__`;
            } else if (auto.dm === "3") {
              dmEmbed = `You've been ${action} from **${message.guild.name}**\n__(Auto Punish Triggered)__\n\n**Warn Count:** ${warnDoc.warnings.length}`;
            }

            mentionedMember
              .sendError({
                title: "Warn",
                description: dmEmbed,
              })
              .catch((err) => console.log(err));
          }
        }
      }
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
                      `Action: \`Warn\` | ${mentionedMember.user.tag} | Case #${logcase}`,
                      mentionedMember.user.displayAvatarURL({ format: "png" })
                    )
                    .setDescription(
                      `**User:** ${mentionedMember}\n**Reason:** ${reason}\n **Responsible Moderator:** ${message.author}`
                    )
                    .setFooter({
                      text: `ID: ${mentionedMember.id} | Warn ID: ${warnID}`,
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
    }
  },
};
