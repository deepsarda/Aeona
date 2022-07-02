const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "userinfo",
  description: "View someone's info",
  usage: "+userinfo [@user]",
  category: "info",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    const user = parseUser(message, args);

    return message.channel.send({
      title: `${user.displayName} info`,
      description: `**ID:** ${user.user.id}\n**Username:** ${
        user.user.username
      }\n**Discriminator:** ${
        user.user.discriminator
      }\n**Created at:** <t:${user.user.createdTimestamp/ 1000 | 0}:R>\n**Joined at:** <t:${user.joinedTimestamp/ 1000 | 0}:R>\n**Bot:** ${
        user.user.bot
      } \n**Highest role:** ${user.roles.highest}\n **Roles:** ${user.roles.cache
        .map((role) => role)
        .join(", ")}\n **Permissions:** ${user.permissions
        .toArray()
        .join(", ")}\n**Avatar:** [Link](${user.user.avatarURL({
        dynamic: true,
        size: 2048,
      })})`,
      thumbnailURL:user.user.avatarURL({
        dynamic: true,
        size: 2048,
      })
    });
  },
};
