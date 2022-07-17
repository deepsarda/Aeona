const ReactionRole = require("../../packages/reactionrole/index.js");
const react = new ReactionRole();

module.exports = {
  name: "editreaction",
  aliases: ["editrr", "editreactionrole"],
  description: "Edit's the reaction role",
  usage: "+editreaction <channel> <messageID> <role> <emoji> ",
  category: "reactionrole",
  requiredArgs: 4,
  premissions: ["MANAGE_GUILD"],
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

    let role =
      message.mentions.roles.first() ||
      message.guild.roles.cache.get(args[2]) ||
      message.guild.roles.cache.find((rl) => rl.name === args[2]);

    if (!role)
      return message.replyError({
        title: "Reaction Role",
        description: "Please provide a valid role.",
      });
    if (role.managed)
      return message.replyError({
        title: "Reaction Role",
        description: "Please do not use a integration  role.",
      });

    let emoji = message.guild.emojis.cache.find(
      (emoji) => emoji.name.toLowerCase() === args[3].toLowerCase()
    );
    await react.reactionEdit(bot, message.guild.id, ID, role.id, emoji);
    return message.reply({
      title: "Reaction Role",
      description: `Reaction role created successfully. \n **Channel** : ${channel} \n **Message ID** : ${ID} \n **Role** : ${role} \n **Emoji** : ${emoji} \n **[View](https://discordapp.com/channels/${message.guild.id}/${channel.id}/${ID})**]`,
    });
  },
};
