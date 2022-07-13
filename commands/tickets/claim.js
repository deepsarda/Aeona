const ticketSchema = require("../../database/schemas/tickets.js");

module.exports = {
  name: "claim",
  description: "Claim this ticket",
  usage: "+claim",
  category: "tickets",
  requiredArgs: 0,
  premissions: ["MANAGE_ROLES"],
  execute: async (message, args, bot, prefix) => {
    let db = await ticketSchema.findOne({
      guildID: message.guild.id,
    });

    if (!db)
      return message.replyError({
        title: "Ticket",
        description: "Tickets are not enabled on this server.",
      });

    if (!message.channel.name.startsWith("ticket-"))
      return message.replyError({
        title: "Ticket",
        description: "This channel is not a ticket",
      });

    let ticketRole = message.guild.roles.cache.get(db.supportRoleID);
    let ticketCategory = message.guild.channels.cache.get(db.categoryID);
    let ticketLog = message.guild.channels.cache.get(db.ticketModlogID);

    message.channel.permissionOverwrites
      .edit(message.member, {
        VIEW_CHANNEL: true,
      })
      .catch((err) => {
        message.channel.sendError({
          title: "Ticket",
          description: "I don't have permission to do this.",
        });
      });
    message.channel.permissionOverwrites
      .edit(ticketRole.id, {
        VIEW_CHANNEL: false,
      })
      .catch((err) => {
        message.channel.sendError({
          title: "Ticket",
          description: "I don't have permission to do this.",
        });
      });

    let Aeona = message.guild.me;
    let everyone = message.guild.roles.everyone;

    message.channel.permissionOverwrites
      .edit(Aeona.id, {
        VIEW_CHANNEL: true,
        SEND_MESSAGES: true,
        READ_MESSAGE_HISTORY: true,
        ATTACH_FILES: true,
      })
      .catch((err) => {
        console.log(err);
        message.channel.sendError({
          title: "Ticket",
          description: "I don't have permission to do this.",
        });
      });
    message.channel.permissionOverwrites
      .edit(everyone.id, { VIEW_CHANNEL: false })
      .catch((err) => {
        console.log(err);
        message.channel.sendError({
          title: "Ticket",
          description: "I don't have permission to do this.",
        });
      });

    message.reply({
      title: "Ticket",
      description: "You have claimed this ticket.",
    });
  },
};
