const { MessageEmbed } = require("discord.js");
const Db = require("../../packages/reactionrole/models/schema.js");
const reactionTicket = require("../../database/schemas/tickets.js");
const reactionCooldown = new Set();
const discord = require("discord.js");
const moment = require("moment");
const GuildDB = require("../../database/schemas/Guild");
const ticketCooldownLol = new Set();
const botCooldown = new Set();

module.exports = {
  name: "messageReactionAdd",
  async execute(client, messageReaction, user) {
    if (client.user === user) return;

    const { message, emoji } = messageReaction;

    const member = message.guild.members.cache.get(user.id);
    let guildDB = await GuildDB.findOne({
      guildId: message.guild.id,
    });
    await Db.findOne(
      {
        guildid: message.guild.id,
        reaction: emoji.toString(),
        msgid: message.id,
      },

      async (err, db) => {
        if (!db) return;

        if (message.id != db.msgid) return;

        const rrRole = message.guild.roles.cache.get(db.roleid);

        if (!rrRole) return;

        if (botCooldown.has(message.guild.id)) return;

        let guild = client.guilds.cache.get(db.guildid);
        let guildName = guild.name;

        let slowDownEmbed = new MessageEmbed()
          .setDescription(
            `${message.client.emoji.fail} Slow Down There, You're on a cooldown\n\n**Role Name:** ${rrRole.name}\n**Guild Name:** ${guildName}`
          )
          .setColor("RED");

        let addEmbed = new MessageEmbed()
          .setAuthor(
            "Role Added",
            `${message.client.domain}/logo.png`,
            `${message.url}`
          )
          .setDescription(
            `You have recieved the **${rrRole.name}** Role by reacting in ${guildName}`
          )
          .setFooter({ text: "https://Aeona.xyz/" })
          .setColor("GREEN");

        let remEmbed = new MessageEmbed()
          .setAuthor(
            "Role Removed",
            `${message.client.domain}/logo.png`,
            `${message.url}`
          )
          .setDescription(
            `You have removed the **${rrRole.name}** Role by reacting in ${guildName}`
          )
          .setFooter({ text: "https://Aeona.xyz/" })
          .setColor("GREEN");

        let errorReaction = new MessageEmbed()
          .setAuthor(
            "Reaction Role Error",
            `${message.client.domain}/logo.png`,
            `${message.url}`
          )
          .setDescription(
            `${message.client.emoji.fail} Failed to Add the role, since I'm Missing the Manage Roles Permission.\n\nPlease let an admin Know.`
          )
          .setFooter({ text: "https://Aeona.xyz/" })
          .setColor("GREEN");

        if (reactionCooldown.has(user.id)) {
          if (
            message.channel &&
            message.channel.viewable &&
            message.channel
              .permissionsFor(message.guild.me)
              .has(["SEND_MESSAGES", "EMBED_LINKS"])
          ) {
            user.send({ embeds: [slowDownEmbed] }).catch(() => {});
            botCooldown.add(message.guild.id);
            setTimeout(() => {
              botCooldown.delete(message.guild.id);
            }, 4000);
          }
        }

        if (db.option === 1) {
          try {
            if (
              !member.roles.cache.find(
                (r) => r.name.toLowerCase() === rrRole.name.toLowerCase()
              )
            ) {
              await member.roles.add(rrRole).catch(() => {});
              if (guildDB.reactionDM === true) {
                member.send({ embeds: [addEmbed] }).catch(() => {});
              }
              reactionCooldown.add(user.id);
              setTimeout(() => {
                reactionCooldown.delete(user.id);
              }, 2000);
            }
          } catch (err) {
            console.log(err);
            if (
              !message.channel
                .permissionsFor(message.guild.me)
                .has("SEND_MESSAGES")
            )
              return;
            botCooldown.add(message.guild.id);
            setTimeout(() => {
              botCooldown.delete(message.guild.id);
            }, 6000);
            return member.send({ embeds: [errorReaction] }).catch(() => {});
          }
        }

        if (db.option === 2) {
          try {
            if (
              !member.roles.cache.find(
                (r) => r.name.toLowerCase() === rrRole.name.toLowerCase()
              )
            ) {
              await member.roles.add(rrRole).catch(() => {});
              if (guildDB.reactionDM === true) {
                member.send({ embeds: [addEmbed] }).catch(() => {});
              }
              reactionCooldown.add(user.id);
              setTimeout(() => {
                reactionCooldown.delete(user.id);
              }, 2000);
            }
          } catch (err) {
            if (
              !message.channel
                .permissionsFor(message.guild.me)
                .has("SEND_MESSAGES")
            )
              return;
            botCooldown.add(message.guild.id);
            setTimeout(() => {
              botCooldown.delete(message.guild.id);
            }, 6000);
            return member.send({ embeds: [errorReaction] }).catch(() => {});
          }
        }

        if (db.option === 3) {
          try {
            if (
              member.roles.cache.find(
                (r) => r.name.toLowerCase() === rrRole.name.toLowerCase()
              )
            ) {
              await member.roles.remove(rrRole).catch(() => {});
              if (guildDB.reactionDM === true) {
                member.send({ embeds: [remEmbed] }).catch(() => {});
              }
              reactionCooldown.add(user.id);
              setTimeout(() => {
                reactionCooldown.delete(user.id);
              }, 2000);
            }
          } catch (err) {
            if (
              !message.channel
                .permissionsFor(message.guild.me)
                .has("SEND_MESSAGES")
            )
              return;
            botCooldown.add(message.guild.id);
            setTimeout(() => {
              botCooldown.delete(message.guild.id);
            }, 6000);
            return member.send({ embeds: [errorReaction] }).catch(() => {});
          }
        }

        if (db.option === 4) {
          try {
            if (
              member.roles.cache.find(
                (r) => r.name.toLowerCase() === rrRole.name.toLowerCase()
              )
            ) {
              await member.roles.remove(rrRole).catch(() => {});
              reactionCooldown.add(user.id);
              if (guildDB.reactionDM === true) {
                member.send({ embeds: [remEmbed] }).catch(() => {});
              }
              setTimeout(() => {
                reactionCooldown.delete(user.id);
              }, 2000);
            }
          } catch (err) {
            if (
              !message.channel
                .permissionsFor(message.guild.me)
                .has("SEND_MESSAGES")
            )
              return;
            botCooldown.add(message.guild.id);
            setTimeout(() => {
              botCooldown.delete(message.guild.id);
            }, 6000);
            return member.send({ embeds: [errorReaction] }).catch(() => {});
          }
        }

        if (db.option === 5) {
          try {
            if (
              member.roles.cache.find(
                (r) => r.name.toLowerCase() === rrRole.name.toLowerCase()
              )
            ) {
              await member.roles.remove(rrRole);
              message.reactions.cache
                .find((r) => r.emoji.name == emoji.name)
                .users.remove(user.id)
                .catch(() => {});

              if (guildDB.reactionDM === true) {
                member.send({ embeds: [remEmbed] }).catch(() => {});
              }
              reactionCooldown.add(user.id);
              setTimeout(() => {
                reactionCooldown.delete(user.id);
              }, 2000);
            }
          } catch (err) {
            if (
              !message.channel
                .permissionsFor(message.guild.me)
                .has("SEND_MESSAGES")
            )
              return;
            botCooldown.add(message.guild.id);
            setTimeout(() => {
              botCooldown.delete(message.guild.id);
            }, 6000);
            return member.send({ embeds: [errorReaction] }).catch(() => {});
          }
        }

        if (db.option === 6) {
          try {
            if (
              member.roles.cache.find(
                (r) => r.name.toLowerCase() === rrRole.name.toLowerCase()
              )
            ) {
              message.reactions.cache
                .find((r) => r.emoji.name == emoji.name)
                .users.remove(user.id)
                .catch(() => {});
              await member.roles.remove(rrRole).catch(() => {});

              reactionCooldown.add(user.id);
              setTimeout(() => {
                reactionCooldown.delete(user.id);
              }, 5000);

              return;
            } else if (
              !member.roles.cache.find(
                (r) => r.name.toLowerCase() === rrRole.name.toLowerCase()
              )
            ) {
              message.reactions.cache
                .find((r) => r.emoji.name == emoji.name)
                .users.remove(user.id)
                .catch(() => {});
              await member.roles.add(rrRole).catch(() => {});

              if (guildDB.reactionDM === true) {
                member.send({ embeds: [addEmbed] }).catch(() => {});
              }
              reactionCooldown.add(user.id);
              setTimeout(() => {
                reactionCooldown.delete(user.id);
              }, 5000);
            }
          } catch (err) {
            if (
              !message.channel
                .permissionsFor(message.guild.me)
                .has("SEND_MESSAGES")
            )
              return;
            botCooldown.add(message.guild.id);
            setTimeout(() => {
              botCooldown.delete(message.guild.id);
            }, 6000);
            return member.send({ embeds: [errorReaction] }).catch(() => {});
          }
        }
      }
    );

    //ticket stuff
    await reactionTicket.findOne(
      {
        guildID: message.guild.id,
      },
      async (err, db) => {
        if (!db) return;

        if (db.ticketType == "reaction") {
          if (db.messageID.includes(message.id)) {
            if (
              emoji.toString() === "🎫" ||
              emoji.toString() === "🎟️" ||
              emoji.toString() === "📩" ||
              emoji.toString() === "✅" ||
              emoji.toString() === "📻" ||
              emoji.toString() === "☑️" ||
              emoji.toString() === "📲" ||
              emoji.toString() === "📟" ||
              emoji.toString() === "🆕" ||
              emoji.toString() === "📤" ||
              emoji.toString() === "📨" ||
              emoji.toString() === "🔑" ||
              emoji.toString() === "🏷️"
            ) {
              if (guildDB.isPremium == "false") {
                if (
                  emoji.toString() === "🎟️" ||
                  emoji.toString() === "✅" ||
                  emoji.toString() === "📻" ||
                  emoji.toString() === "☑️" ||
                  emoji.toString() === "📲" ||
                  emoji.toString() === "📟" ||
                  emoji.toString() === "🆕" ||
                  emoji.toString() === "📤" ||
                  emoji.toString() === "📨" ||
                  emoji.toString() === "🔑" ||
                  emoji.toString() === "🏷️"
                )
                  return;
              }
              let serverCase = db.ticketCase;
              if (!serverCase || serverCase === null) serverCase = "1";

              let channelReact = message.guild.channels.cache.get(
                db.ticketReactChannel
              );
              let ticketRole = message.guild.roles.cache.get(db.supportRoleID);
              let ticketCategory = message.guild.channels.cache.get(
                db.categoryID
              );
              let ticketLog = await message.guild.channels.fetch(
                db.ticketModlogID
              );

              message.reactions.cache
                .find((r) => r.emoji.name == emoji.name)
                .users.remove(user.id)
                .catch(() => {});

              let id = user.id.toString().substr(0, 4) + user.discriminator;
              let chann = `ticket-${id}`;

              let array = [];

              message.guild.channels.cache.forEach((channel) => {
                if (channel.name == chann) array.push(channel.id);
              });

              let ticketlimit = db.maxTicket;
              if (!ticketlimit) ticketlimit = 1;

              let arraylength = array.length;

              if (arraylength > ticketlimit || arraylength == ticketlimit) {
                if (ticketCooldownLol.has(user.id)) return;
                if (
                  !message.channel
                    .permissionsFor(message.guild.me)
                    .has("SEND_MESSAGES")
                )
                  return;
                if (
                  !message.channel
                    .permissionsFor(message.guild.me)
                    .has("EMBED_LINKS")
                )
                  return;

                message.channel
                  .send({
                    embeds: [
                      new discord.MessageEmbed()
                        .setDescription(
                          `You already have ${arraylength} open tickets, as the current guild's ticket limit is ${ticketlimit} `
                        )
                        .setAuthor(user.tag, user.displayAvatarURL())
                        .setFooter({ text: "https://Aeona.xyz/" }),
                    ],
                  })
                  .then((m) => m.delete({ timeout: 5000 }));
                ticketCooldownLol.add(user.id);
                setTimeout(() => {
                  ticketCooldownLol.delete(user.id);
                }, 10000);

                return;
              }

              let Aeona = message.guild.me;

              let everyone = message.guild.roles.everyone;

              message.guild.channels
                .create(chann, {
                  permissionOverwrites: [
                    {
                      allow: [
                        "VIEW_CHANNEL",
                        "SEND_MESSAGES",
                        "ATTACH_FILES",
                        "READ_MESSAGE_HISTORY",
                        "ADD_REACTIONS",
                        "MANAGE_CHANNELS",
                      ],
                      id: message.guild.me,
                    },

                    {
                      allow: [
                        "VIEW_CHANNEL",
                        "SEND_MESSAGES",
                        "ATTACH_FILES",
                        "READ_MESSAGE_HISTORY",
                        "ADD_REACTIONS",
                      ],
                      id: user,
                    },
                    {
                      allow: [
                        "VIEW_CHANNEL",
                        "SEND_MESSAGES",
                        "ATTACH_FILES",
                        "READ_MESSAGE_HISTORY",
                        "ADD_REACTIONS",
                      ],
                      id: ticketRole,
                    },

                    {
                      deny: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                      id: message.guild.roles.everyone,
                    },
                  ],
                  parent: ticketCategory.id,
                  reason: `Ticket Module`,
                  topic: `**ID:** ${user.id} | **Tag:** ${user.tag}`,
                })
                .then(async (chan) => {
                  await chan.permissionOverwrites.edit(user, {
                    VIEW_CHANNEL: true,
                    SEND_MESSAGES: true,
                    READ_MESSAGE_HISTORY: true,
                    ATTACH_FILES: true,
                  });
                  await db.updateOne({ ticketCase: serverCase + 1 });

                  let color = db.ticketWelcomeColor;
                  if (color == "#000000")
                    color = message.guild.me.displayHexColor;

                  if (db.ticketPing == "true") {
                    if (chan) {
                      chan
                        .send({ content: `${member} ${ticketRole}` })
                        .catch(() => {});
                    }
                  }
                  let row = new discord.MessageActionRow();
                  row.addComponents([
                    new discord.MessageButton()
                      .setLabel("Close")
                      .setStyle("SECONDARY")
                      .setCustomId("close"),
                    new discord.MessageButton()
                      .setLabel("Claim (Staff)")
                      .setStyle("SECONDARY")
                      .setCustomId("claim"),
                  ]);

                  chan.send({
                    embeds: [
                      new discord.MessageEmbed()
                        .setAuthor(user.tag, user.displayAvatarURL())

                        .setDescription(
                          db.ticketWelcomeMessage
                            .replace(/{user}/g, `${member}`)
                            .replace(/{user_tag}/g, `${member.tag}`)
                            .replace(/{user_name}/g, `${member.username}`)
                            .replace(/{reason}/g, `${member.username}`)
                            .replace(/{user_ID}/g, `${member.id}`) ||
                            language.ticketNewTicketWaitForAssistant
                        )

                        .setColor(color),
                    ],
                  });

                  chan.send({
                    content: "@everyone",
                    embeds: [
                      new MessageEmbed()
                        .setDescription(
                          `Please use \`aeona close\` to close the ticket.`
                        )
                        .setColor("RED")
                        .setFooter({ text: "https://Aeona.xyz/" })
                        .setTimestamp(),
                    ],
                    components: [row],
                  });

                  let color2 = db.ticketLogColor;
                  if (color2 == "#000000") color2 = `#36393f`;

                  const embedLog = new discord.MessageEmbed()
                    .setColor(color2)
                    .setFooter({ text: "https://Aeona.xyz/" })
                    .setTitle("Ticket Created")
                    .setTimestamp()
                    .addField(
                      "Information",
                      `**User:** ${user}\n**Ticket Channel: **${
                        chan.name
                      }\n**Ticket:** #${serverCase}\n**Date:** ${moment(
                        new Date()
                      ).format("dddd, MMMM Do YYYY")} `
                    );

                  if (ticketLog) {
                    ticketLog.send({ embeds: [embedLog] });
                  }
                })
                .catch((e) => {
                  console.error(e);
                  message.channel
                    .send({
                      embeds: [
                        new discord.MessageEmbed()
                          .setColor("RED")
                          .setDescription(
                            "There was an error creating the ticket, please check my permissions or contact support."
                          ),
                      ],
                    })
                    .then((m) => m.delete({ timeout: 5000 }))
                    .catch(() => {});
                });
            }
          }
        }
      }
    );
  },
};
