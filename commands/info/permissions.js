const parseUser = require("../../utils/parseUser.js");

module.exports = {
  name: "permissions",
  description: "View the permissions of a user",
  usage: "+permissions [@user]",
  category: "info",
  aliases: ["perms"],
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    let user = parseUser(message, args);
    const memberPermissions = user.permissions.toArray();
    const finalPermissions = [];
    for (const permission in permissions) {
      if (memberPermissions.includes(permission))
        finalPermissions.push(`+ ${permissions[permission]}`);
      else finalPermissions.push(`- ${permissions[permission]}`);
    }

    return message.channel.send({
      title: `${user.displayName} permissions`,
      description: finalPermissions.join("\n"),
    });
  },
};
