const transcriptSchema = require("../../database/schemas/transcript.js");
const ticketSchema = require("../../database/schemas/tickets.js");
const randoStrings = require("randostrings");
const random = new randoStrings();
const moment = require("moment");
const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "close",
  description: "Close a ticket",
  usage: "+close",
  category: "tickets",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    if (!message.channel.name.startsWith("ticket-"))
      return message.replyError({
        title: "Ticket",
        description: "This channel is not a ticket",
      });

    let db = await ticketSchema.findOne({
      guildID: message.guild.id,
    });

    if (!db)
      return message.replyError({
        title: "Ticket",
        description: "Tickets are not enabled on this server.",
      });
    let channelReact = await message.guild.channels.fetch(db.ticketModlogID);
    let reason = args.slice(0).join(" ");
    if (!reason) reason = "No reason Was Provided";
    const role = await message.guild.roles.fetch(db.supportRoleID);
    await message.channel.messages
      .fetch()
      .then(async (messages) => {
        let text = "";

        let ticketID = random.password({
          length: 8,
          string: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
        });

        const paste = new transcriptSchema({
          _id: ticketID,
          type: "ticket",
          by: message.author.id,
          expiresAt: new Date(Date.now() + 1036800000),
        });

        for (const message of messages.reverse().values()) {
          if (message && message.content && message.author.id) {
            paste.paste.push(`${message.content}`);
            paste.paste2.push(message.author.id);
          } else if (message && message.embeds && message.author.id) {
            paste.paste.push(`(embed sent)`);
            paste.paste2.push(message.author.id);
          }
        }

        if (channelReact) {
          let color2 = db.ticketLogColor;
          if (color2 == "#000000") color2 = `#36393f`;

          let closeEmbed = new MessageEmbed()
            .setColor(color2)
            .setTitle("Ticket Closed")
            .addField(
              "Information",
              `**User:** ${message.author}\n**Ticket Channel:** #${
                message.channel.name
              }\n**Reason:** ${reason}\n**Date:** ${moment(new Date()).format(
                "dddd, MMMM Do YYYY"
              )}\n**Transcript:** [here](https://Aeona.xyz/paste/${ticketID})`
            );

          channelReact.send({ embeds: [closeEmbed] }).catch(() => {});
          message.member.send({ embeds: [closeEmbed] }).catch(() => {});
        }

        await paste.save().catch(() => {});
      })
      .catch((e) => {
        console.log(e);
      });

    setTimeout(() => message.channel.delete(), 10000);
  },
};
