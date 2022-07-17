const ticketSchema = require("../../database/schemas/tickets.js");

module.exports = {
  name: "rrticket",
  description: "Create a reaction role to open the ticket",
  usage: "+rrticket <channel> <messageId>",
  category: "tickets",
  requiredArgs: 2,
  execute: async (message, args, bot, prefix) => {
    let channel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.get(args[0]) ||
      message.guild.channels.cache.find((ch) => ch.name === args[0]);
    if (!channel)
      return message.replyError({
        title: "Ticket",
        description: "Please provide a valid channel.",
      });
    let ID = args[1];
    let messageID = await channel.messages.fetch(ID).catch(() => {
      return message.replyError({
        title: "Ticket",
        description: "Please provide a valid message ID.",
      });
    });

    let db = await ticketSchema.findOne({
      guildID: message.guild.id,
    });

    if (!db) {
      db = new ticketSchema({
        guildID: guild.id,
      });
      db.ticketType = "reaction";
    }

    db.messageID = ID;
    await db.save();
    await messageID.react(db.ticketReaction);

    return message.reply({
      title: "Ticket",
      description: `Ticker Reaction created! [url](https://discordapp.com/channels/${message.guild.id}/${channel.id}/${ID})`,
    });
  },
};
