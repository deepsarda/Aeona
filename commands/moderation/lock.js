const Logging = require("../../database/schemas/logging.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "lock",
  description: "Lock the specified channel",
  usage: "+lock <channel> ",
  category: "moderation",
  requiredArgs: 0,
  permissions: ["MANAGE_CHANNELS"],
  botPermissions: ["MANAGE_CHANNELS"],
  execute: async (message, args, bot, prefix) => {
    const logging = await Logging.findOne({ guildId: message.guild.id });

    let channel = message.mentions.channels.first();
    let reason = args.join(" ") || "`none`";

    let member = message.guild.roles.cache.find(
      (r) => r.name.toLowerCase() === "member"
    );
    let memberr = message.guild.roles.cache.find(
      (r) => r.name.toLowerCase() === "members"
    );
    let verified = message.guild.roles.cache.find(
      (r) => r.name.toLowerCase() === "verified"
    );
    if (channel) {
      reason = args.join(" ").slice(22) || "`none`";
    } else channel = message.channel;

    if (
      channel.permissionsFor(message.guild.id).has("SEND_MESSAGES") === false
    ) {
      const lockchannelError2 = new MessageEmbed()
        .setDescription(` ${channel} is already locked`)
        .setColor(client.color.red);

      return message.reply(lockchannelError2);
    }

    channel.permissionOverwrites
      .edit(message.guild.me, { SEND_MESSAGES: true })
      .catch(() => {});

    channel.permissionOverwrites
      .edit(message.guild.id, { SEND_MESSAGES: false })
      .catch(() => {});

    channel.permissionOverwrites
      .edit(message.author.id, { SEND_MESSAGES: true })
      .catch(() => {});

    if (member)
      channel.permissionOverwrites
        .edit(member, { SEND_MESSAGES: false })
        .catch(() => {});

    if (memberr)
      channel.permissionOverwrites
        .edit(memberr, { SEND_MESSAGES: false })
        .catch(() => {});

    if (verified)
      channel.permissionOverwrites
        .edit(verified, { SEND_MESSAGES: false })
        .catch(() => {});

    message.channel
      .send({
        title: "Lock",
        description: `${channel} has been locked. (${reason})`,
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
              if (logging.moderation.lock == "true") {
                let color = logging.moderation.color;
                if (color == "#000000") color = message.guild.me.displayHexColor;

                let logcase = logging.moderation.caseN;
                if (!logcase) logcase = `1`;

                let reason = args.slice(1).join(" ");
                if (!reason) reason = `${language.noReasonProvided}`;
                if (reason.length > 1024)
                  reason = reason.slice(0, 1021) + "...";

                const logEmbed = new MessageEmbed()
                  .setAuthor(
                    `Action: \`Lock\` | ${message.author.tag} | Case #${logcase}`,
                    message.author.displayAvatarURL({ format: "png" })
                  )
                  .setDescription(`**Channel:** ${channel} \n**Reason:** ${reason} \n **Responsible Moderator:** ${message.author}`)
                  .setFooter({ text: `ID: ${message.author.id}` })
                  .setTimestamp()
                  .setColor(color);

                channel.send({ embed: [logEmbed] }).catch(() => {});

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
