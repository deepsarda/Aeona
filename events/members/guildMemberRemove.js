const Guild = require("../../database/schemas/Guild");
const discord = require("discord.js");
const moment = require("moment");
const LeaveDB = require("../../database/schemas/leave");
const StickyDB = require("../../database/schemas/stickyRole");
const Logging = require("../../database/schemas/logging");
module.exports = {
  name: "guildMemberRemove",
  async execute(client, member) {
    console.log(member);
    const logging = await Logging.findOne({ guildId: member.guild.id });



    if (logging) {
      if (logging.server_events.toggle == "true") {
        const channelEmbed = await member.guild.channels.cache.get(
          logging.server_events.channel
        );

        if (channelEmbed) {
          let color = logging.server_events.color;
          if (color == "#000000") color = "RED";

          if (logging.server_events.member_join == "true") {
            const embed = new discord.MessageEmbed()
              .setTitle(":outbox_tray: Member Left")
              .setAuthor(
                `${member.guild.name}`,
                member.guild.iconURL({ dynamic: true })
              )
              .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
              .setDescription(`${member} (**${member.user.tag}**)`)
              .addField(
                "Account created on",
                moment(member.user.createdAt).format("dddd, MMMM Do YYYY")
              )
              .setTimestamp()
              .setColor(member.guild.me.displayHexColor);
            channelEmbed.send({ embeds: [embed] }).catch(() => { });
          }
        }
      }
    }

    let guildDB = await Guild.findOne({
      guildId: member.guild.id,
    });

    if (guildDB) {
      guildDB.leaves.forEach(async (leave) => {
        let xx = leave - Date.now();
        let createdd = Math.floor(xx / 86400000);

        if (6 <= createdd) {
          removeA(guildDB.leaves, leave);
          await guildDB.save().catch(() => { });
        }
      });

      guildDB.leaves.push(Date.now());
      await guildDB.save().catch(() => { });
    }

    if (guildDB.verification.enabled) getVerification(guildDB, member.guild);
    let leave = await LeaveDB.findOne({
      guildId: member.guild.id,
    });

    if (!leave) {
      const newSettings = new LeaveDB({
        guildId: member.guild.id,
      });
      await newSettings.save().catch(() => { });
      leave = await LeaveDB.findOne({ guildId: member.guild.id });
    }

    if (leave.leaveToggle == "true") {
      if (leave.leaveDM == "true") {
        let text = leave.leaveMessage
          .replace(/{user}/g, `${member}`)
          .replace(/{user_tag}/g, `${member.user.tag}`)
          .replace(/{user_name}/g, `${member.user.username}`)
          .replace(/{user_ID}/g, `${member.id}`)
          .replace(/{guild_name}/g, `${member.guild.name}`)
          .replace(/{guild_ID}/g, `${member.guild.id}`)
          .replace(/{memberCount}/g, `${member.guild.memberCount}`)
          .replace(/{size}/g, `${member.guild.memberCount}`)
          .replace(/{guild}/g, `${member.guild.name}`)
          .replace(
            /{member_createdAtAgo}/g,
            `${moment(member.user.createdTimestamp).fromNow()}`
          )
          .replace(
            /{member_createdAt}/g,
            `${moment(member.user.createdAt).format("MMMM Do YYYY, h:mm:ss a")}`
          );

        if (leave.leaveEmbed == "false") {
          member.send(`${text}`).catch(() => { });
        }
        if (leave.leaveEmbed == "true") {
          let embed = new discord.MessageEmbed();

          let color = leave.embed.color;
          if (color) embed.setColor(color);

          let title = leave.embed.title;
          if (title !== null) embed.setTitle(title);

          let titleUrl = leave.embed.titleURL;
          if (titleUrl !== null) embed.setURL(titleUrl);

          let textEmbed = leave.embed.description
            .replace(/{user}/g, `${member}`)
            .replace(/{user_tag}/g, `${member.user.tag}`)
            .replace(/{user_name}/g, `${member.user.username}`)
            .replace(/{user_ID}/g, `${member.id}`)
            .replace(/{guild_name}/g, `${member.guild.name}`)
            .replace(/{guild_ID}/g, `${member.guild.id}`)
            .replace(/{memberCount}/g, `${member.guild.memberCount}`)
            .replace(/{size}/g, `${member.guild.memberCount}`)
            .replace(/{guild}/g, `${member.guild.name}`)
            .replace(
              /{member_createdAtAgo}/g,
              `${moment(member.user.createdTimestamp).fromNow()}`
            )
            .replace(
              /{member_createdAt}/g,
              `${moment(member.user.createdAt).format(
                "MMMM Do YYYY, h:mm:ss a"
              )}`
            );

          if (textEmbed !== null) embed.setDescription(textEmbed);

          let authorName = leave.embed.author.name
            .replace(/{user_tag}/g, `${member.user.tag}`)
            .replace(/{user_name}/g, `${member.user.username}`)
            .replace(/{user_ID}/g, `${member.id}`)
            .replace(/{guild_name}/g, `${member.guild.name}`)
            .replace(/{guild_ID}/g, `${member.guild.id}`)
            .replace(/{memberCount}/g, `${member.guild.memberCount}`)
            .replace(/{size}/g, `${member.guild.memberCount}`)
            .replace(/{guild}/g, `${member.guild.name}`);

          if (authorName !== null) embed.setAuthor(authorName);

          let authorIcon = leave.embed.author.icon;
          if (authorIcon !== null) embed.setAuthor(authorName, authorIcon);

          let authorUrl = leave.embed.author.url;
          if (authorUrl !== null)
            embed.setAuthor(authorName, authorIcon, authorUrl);

          let footer = leave.embed.footer;
          if (footer !== null) embed.setFooter(footer);

          let footerIcon = leave.embed.footerIcon;
          if (footer && footerIcon !== null)
            embed.setFooter(footer, footerIcon);

          let timestamp = leave.embed.timestamp;
          if (timestamp == "true") embed.setTimestamp();

          let thumbnail = leave.embed.thumbnail;
          if (thumbnail === "{userAvatar}")
            thumbnail = member.user.displayAvatarURL({
              dynamic: true,
              size: 512,
            });
          if (thumbnail !== null) embed.setThumbnail(thumbnail);

          member.send({ embeds: [embed] }).catch(() => { });
        }
      }
      if (leave.leaveDM == "false") {
        if (leave.leaveChannel) {
          const greetChannel = member.guild.channels.cache.get(
            leave.leaveChannel
          );
          if (greetChannel) {
            let text = leave.leaveMessage
              .replace(/{user}/g, `${member}`)
              .replace(/{user_tag}/g, `${member.user.tag}`)
              .replace(/{user_name}/g, `${member.user.username}`)
              .replace(/{user_ID}/g, `${member.id}`)
              .replace(/{guild_name}/g, `${member.guild.name}`)
              .replace(/{guild_ID}/g, `${member.guild.id}`)
              .replace(/{memberCount}/g, `${member.guild.memberCount}`)
              .replace(/{size}/g, `${member.guild.memberCount}`)
              .replace(/{guild}/g, `${member.guild.name}`)
              .replace(
                /{member_createdAtAgo}/g,
                `${moment(member.user.createdTimestamp).fromNow()}`
              )
              .replace(
                /{member_createdAt}/g,
                `${moment(member.user.createdAt).format(
                  "MMMM Do YYYY, h:mm:ss a"
                )}`
              );

            if (leave.leaveEmbed == "false") {
              greetChannel.send(`${text}`).catch(() => { });
            }
            if (leave.leaveEmbed == "true") {
              let embed = new discord.MessageEmbed();

              let color = leave.embed.color;
              if (color) embed.setColor(color);

              let title = leave.embed.title;
              if (title !== null) embed.setTitle(title);

              let titleUrl = leave.embed.titleURL;
              if (titleUrl !== null) embed.setURL(titleUrl);

              let textEmbed = leave.embed.description
                .replace(/{user}/g, `${member}`)
                .replace(/{user_tag}/g, `${member.user.tag}`)
                .replace(/{user_name}/g, `${member.user.username}`)
                .replace(/{user_ID}/g, `${member.id}`)
                .replace(/{guild_name}/g, `${member.guild.name}`)
                .replace(/{guild_ID}/g, `${member.guild.id}`)
                .replace(/{memberCount}/g, `${member.guild.memberCount}`)
                .replace(/{size}/g, `${member.guild.memberCount}`)
                .replace(/{guild}/g, `${member.guild.name}`)
                .replace(
                  /{member_createdAtAgo}/g,
                  `${moment(member.user.createdTimestamp).fromNow()}`
                )
                .replace(
                  /{member_createdAt}/g,
                  `${moment(member.user.createdAt).format(
                    "MMMM Do YYYY, h:mm:ss a"
                  )}`
                );

              if (textEmbed !== null) embed.setDescription(textEmbed);

              let authorName = leave.embed.author.name
                .replace(/{user_tag}/g, `${member.user.tag}`)
                .replace(/{user_name}/g, `${member.user.username}`)
                .replace(/{user_ID}/g, `${member.id}`)
                .replace(/{guild_name}/g, `${member.guild.name}`)
                .replace(/{guild_ID}/g, `${member.guild.id}`)
                .replace(/{memberCount}/g, `${member.guild.memberCount}`)
                .replace(/{size}/g, `${member.guild.memberCount}`)
                .replace(/{guild}/g, `${member.guild.name}`);

              if (authorName !== null) embed.setAuthor(authorName);

              let authorIcon = leave.embed.author.icon;
              if (authorIcon !== null) embed.setAuthor(authorName, authorIcon);

              let authorUrl = leave.embed.author.url;
              if (authorUrl !== null)
                embed.setAuthor(authorName, authorIcon, authorUrl);

              let footer = leave.embed.footer;
              if (footer !== null) embed.setFooter(footer);

              let footerIcon = leave.embed.footerIcon;
              if (footer && footerIcon !== null)
                embed.setFooter(footer, footerIcon);

              let timestamp = leave.embed.timestamp;
              if (timestamp == "true") embed.setTimestamp();

              let thumbnail = leave.embed.thumbnail;
              if (thumbnail === "{userAvatar}")
                thumbnail = member.user.displayAvatarURL({
                  dynamic: true,
                  size: 512,
                });
              if (thumbnail !== null) embed.setThumbnail(thumbnail);

              greetChannel.send({ embeds: [embed] }).catch(() => { });
            }
          }
        }
      }
    }

    if (guildDB && guildDB.autoroleToggle && guildDB.autoroleToggle === true) {
      if (guildDB.autoroleID) {
        let role = member.guild.roles.cache.get(guildDB.autoroleID);
        if (role) {
          member.roles.add(role).catch(() => { });
        }
      }
    }

    let sticky = await StickyDB.findOne({
      guildId: member.guild.id,
    });

    if (!sticky) {
      const newSettingss = new StickyDB({
        guildId: member.guild.id,
      });
      await newSettingss.save().catch(() => { });
      sticky = await StickyDB.findOne({ guildId: member.guild.id });
    }

    if (sticky) {
      let stickyRoleID = sticky.stickyroleID;
      let stickyRole = member.guild.roles.cache.get(stickyRoleID);
      if (sticky.stickyroleToggle == "true") {
        if (stickyRole) {
          if (
            member.roles.cache.find(
              (r) => r.name.toLowerCase() === stickyRole.name
            )
          ) {
            sticky.stickyroleUser.push(member.id);
            await sticky.save().catch(() => { });
          }
        }
      }
    }
  },
};
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

const Captcha = require("@haileybot/captcha-generator");

async function getVerification(guildDB, guild) {
  let channel = await guild.channels.fetch(guildDB.verification.verificationChannel).catch(() => { });
  if (!channel) return;

  let captcha = new Captcha();
  channel.send({
    title: "Verify Yourself",
    description: "**Enter the text shown in the image below:** \n You have 5 minutes to enter the text. \n Don't bother about the case.",
    files: [new Discord.MessageAttachment(captcha.JPEGStream, "captcha.jpeg")]
  });

  let verified = false;
  let collector = channel.createMessageCollector({ filter: m => !m.author.bot, time: 5 * 60 * 1000 });

  collector.on("collect", async (m) => {

    let role = await guild.roles.fetch(guildDB.verification.verificationRole).catch(() => { });
    if (!role) channel.send("Verification role not found. Please set it in the settings.");

    if (m.content.toLowerCase() === captcha.value.toLowerCase()) {

      try {
        await m.member.roles.add(role);
        verified = true;
        collector.stop();
      } catch (e) {
        channel.send("Error adding role. Please try again. \n Is my role higher than the role you want to add?");
      }

    } else {
      channel.send("Wrong captcha, try again.");
    }
  });

  collector.on("end", async (collected, reason) => {
    if (reason === "time") {
      if (!verified) {
        channel.send("You didn't enter the correct text in time.");
      }
    }
  });
}