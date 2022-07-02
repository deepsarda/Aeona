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
      }\n**Created at:** ${user.user.createdAt.toUTCString()}\n**Joined at:** ${user.user.joinedAt.toUTCString()}\n**Bot:** ${
        user.user.bot
      } \n**Highest role:** ${user.highestRole.name}\n **Roles:** ${user.roles
        .map((role) => role.name)
        .join(", ")}\n **Permissions:** ${user.permissions
        .toArray()
        .join(", ")}\n**Avatar:** [Link](${user.user.avatarURL({
        dynamic: true,
        size: 2048,
      })})`,
    });
  },
};
