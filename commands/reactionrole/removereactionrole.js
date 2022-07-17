const ReactionRole = require("../../packages/reactionrole/index.js");
const react = new ReactionRole();

module.exports = {
  name: "removereactionrole",
  aliases: [
    "removerr",
    "removereaction",
    "rreactionrole",
    "deletereactionrole",
    "delreactionrole",
    "remrr",
    "delrr",
    "delreaction",
    "deletereaction",
  ],
  description: "Remove a reaction role",
  usage: "+removereactionrole <channel> <messageID> <emoji>",
  category: "reactionrole",
  requiredArgs: 3,
  premissions: ["MANAGE_ROLES"],
  execute: async (message, args, bot, prefix) => {
    let channel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.get(args[0]) ||
      message.guild.channels.cache.find((ch) => ch.name === args[0]);
    if (!channel)
      return message.replyError({
        title: "Reaction Role",
        description: "Please provide a valid channel.",
      });
    let ID = args[1];
    let messageID = await channel.messages.fetch(ID).catch(() => {
      return message.replyError({
        title: "Reaction Role",
        description: "Please provide a valid message ID.",
      });
    });

    let emoji = args[3];

    await react.reactionDelete(client, message.guild.id, ID, emoji);
    message.reply({
      title: "Reaction Role",
      description: "Reaction role removed.",
    });
  },
};
