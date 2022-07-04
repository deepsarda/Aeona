const Guild = require("../../database/schemas/Guild");

module.exports = {
  name: "suggestion",
  description: "Enable suggestions for the server",
  usage:
    "+suggestion <enable #channel | disable> / suggestion approve/decline <message ID>",
  category: "config",
  requiredArgs: 1,
  aliases: [],
  permission: ["MANAGE_GUILD"],
  execute: async (message, args, bot, prefix) => {
    const guild = await Guild.findOne({ guildId: message.guild.id });

    let option = args[0];

    if (option === "enable") {
      let channel =
        message.mentions.channels.first() ||
        message.guild.channels.cache.get(args[1]);

      if (!channel)
        return message.replyError({
          title: "Suggestion",
          description: `Please provide a valid channel. \n Valid arguments: \n enable #channel`,
        });

      guild.suggestion.suggestionChannelID = channel.id;
      await guild.save();
      return message.reply({
        title: "Suggestion",
        description: `Suggestion has been enabled.`,
      });
    } else if (option === "disable") {
      guild.suggestion.suggestionChannelID = "";
      await guild.save();
      return message.reply({
        title: "Suggestion",
        description: `Suggestion has been disabled.`,
      });
    } else if (option === "approve" || option === "accept") {
      let channel = await message.guild.channels
        .fetch(guild.suggestion.suggestionChannelID)
        .catch();
      if (!channel)
        return message.replyError({
          title: "Suggestion",
          description: `I can't find the suggestion channel.`,
        });

      if (!args[1])
        return message.replyError({
          title: "Suggestion",
          description: `Please provide a valid message ID.`,
        });

      let msg = await channel.messages.fetch(args[1]);
      if (!msg)
        return message.replyError({
          title: "Suggestion",
          description: `Please provide a valid message ID.`,
        });

      let acceptReason = args.splice(2).join(" ") || "No reason provided";

      if (acceptReason.length > 600)
        return message.replyError({
          title: "Suggestion",
          description: `The reason must be under 600 characters.`,
        });

      msg.edit({
        content: `**Accepted: ** \`${acceptReason}\` \n **Approved by: ** \`${message.author.tag}\``,
      });
    } else if (option === "decline" || option === "reject") {
      let channel = await message.guild.channels
        .fetch(guild.suggestion.suggestionChannelID)
        .catch();
      if (!channel)
        return message.replyError({
          title: "Suggestion",
          description: `I can't find the suggestion channel.`,
        });

      if (!args[1])
        return message.replyError({
          title: "Suggestion",
          description: `Please provide a valid message ID.`,
        });

      let msg = await channel.messages.fetch(args[1]);
      if (!msg)
        return message.replyError({
          title: "Suggestion",
          description: `Please provide a valid message ID.`,
        });

      let acceptReason = args.splice(2).join(" ") || "No reason provided";

      if (acceptReason.length > 600)
        return message.replyError({
          title: "Suggestion",
          description: `The reason must be under 600 characters.`,
        });

      msg.edit({
        content: `**Declined: ** \`${acceptReason}\` \n **Denied by: ** \`${message.author.tag}\``,
      });
    } else {
      return message.replyError({
        title: "Suggestion",
        description: `Please provide a valid option. \n Valid arguments: \n enable #channel \n disable \n approve/accept <message ID> \n decline/reject <message ID>`,
      });
    }
  },
};
