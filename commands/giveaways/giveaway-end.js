module.exports = {
  name: "giveaway-end",
  description: "End a giveaway!",
  aliases: ["gend", "end-giveaway"],
  usage: "+giveaway-end <giveaway id/giveaway prize>",
  category: "giveaways",
  requiredArgs: 1,
  execute: async (message, args, client, prefix) => {
    const query = args.join(" ");
    if (!query)
      return message.reply(
        `${message.member}, you need to specify a giveaway ID or prize!`
      );

    const giveaway =
      client.giveawaysManager.giveaways.find(
        (g) => g.prize === query && g.guildId === message.guild.id
      ) ||
      // Search with giveaway ID
      client.giveawaysManager.giveaways.find(
        (g) => g.messageId === query && g.guildId === message.guild.id
      );

    if (!giveaway)
      return message.reply(
        `${message.member}, I couldn't find a giveaway with that ID!`
      );

    if (giveaway.ended)
      return message.reply(
        `${message.member}, that giveaway has already ended!`
      );

    client.giveawaysManager.end(giveaway.messageId);
  },
};
