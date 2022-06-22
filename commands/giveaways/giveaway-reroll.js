module.exports = {
    name: "giveaway-reroll",
    description: "Reroll a giveaway!",
    aliases: ["greroll", "reroll-giveaway"],
    usage: "+giveaway-reroll <giveaway id/giveaway prize>",
    category: "giveaways",
    requiredArgs: 1,
    execute: async (message, args, bot, prefix) => {
      const query = args.join(" ");
      if (!query)
        return message.channel.send(
          `${message.author}, you need to specify a giveaway ID or prize!`
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
        return message.channel.send(
          `${message.author}, I couldn't find a giveaway with that ID!`
        );
  
      if (!giveaway.ended)
        return message.channel.send(
          `${message.author}, that giveaway has not ended yet!`
        );
  
      client.giveawaysManager.reroll(giveaway.messageId);
    },
  };
  