const parseUser = require("../../utils/parseUser.js");
const Nickname = require("../../database/schemas/nicknames");
const Usernames = require("../../database/schemas/usernames");

module.exports = {
  name: "userinfo",
  description: "View someone's info",
  usage: "+userinfo [@user]",
  category: "info",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    const user = parseUser(message, args);

    let usernames = [];

    // user  tags
    let userName = await Usernames.findOne({
      discordId: user.id,
    });
    if (!userName) {
      const newUser = new Usernames({
        discordId: user.id,
      });

      newUser.save();

      usernames = `No Tags Tracked`;
    } else {
      usernames = userName.usernames.join(" - ");
      if (!userName.usernames.length) usernames = `No Tags Tracked`;
    }

    let nickname = [];

    // user nicknames
    const nicknames = await Nickname.findOne({
      discordId: user.id,
      guildId: message.guild.id,
    });
    if (!nicknames) {
      const newUser = new Nickname({
        discordId: user.id,
        guildId: message.guild.id,
      });

      newUser.save();

      nickname = `No Nicknames Tracked`;
    } else {
      nickname = nicknames.nicknames.join(" - ");
      if (!nicknames.nicknames.length) nickname = `No Nicknames Tracked`;
    }

    const userFlags = (await user.user.fetchFlags()).toArray();

    return message.channel.send({
      title: `${user.displayName} info`,
      description: `**ID:** ${user.user.id}\n**Username:** ${
        user.user.username
      }\n**Discriminator:** ${user.user.discriminator}\n**Created at:** <t:${
        (user.user.createdTimestamp / 1000) | 0
      }:R>\n**Joined at:** <t:${
        (user.joinedTimestamp / 1000) | 0
      }:R>\n**Bot:** ${user.user.bot} \n**Highest role:** ${
        user.roles.highest
      }\n **Roles:** ${user.roles.cache
        .map((role) => role)
        .join(", ")}\n **Permissions:** ${user.permissions
        .toArray()
        .join(", ")}\n**Avatar:** [Link](${user.user.avatarURL({
        dynamic: true,
        size: 2048,
      })})\n**Flags:** ${userFlags.join(
        ", "
      )}\n**Nicknames:** ${nickname}\n**Usernames:** ${usernames}`,
      thumbnailURL: user.user.avatarURL({
        dynamic: true,
        size: 2048,
      }),
    });
  },
};
