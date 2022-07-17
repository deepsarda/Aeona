const Guild = require("../../database/schemas/Guild");

module.exports = {
  name: "bumpreminder",
  description: "Create a reminder to bump your server",
  usage: "+bumpreminder enable <channel> <message> or +bumpreminder disable",
  category: "config",
  requiredArgs: 1,
  permission: ["MANAGE_GUILD"],
  execute: async (message, args, bot, prefix) => {
    const guild = await Guild.findOne({ guildId: message.guild.id });

    if (guild.isPremium === "false")
      return message.replyError({
        title: "Bump Reminder",
        description: `This command is premium only. Get [premium.](${process.env.domain}/premium)`,
      });

    if (args[0] === "enable") {
      let channel =
        message.mentions.channels.first() ||
        message.guild.channels.cache.get(args[1]);

      if (!channel)
        return message.replyError({
          title: `Bump Reminder`,
          description: `Invalid usage!\nPlease retry this command... using the correct syntax.\n\n\`${prefix}bumpreminder <channel> <message>\``,
        });

      guild.bump.channel = channel.id;

      if (args[1]) {
        let message = args.slice(2).join(" ");
        guild.bump.bumpMessage = message;
      }
      guild.bump.enabled = true;
      await guild.save();
      return message.reply({
        title: `Bump Reminder`,
        description: `Bump reminder was successfully set!`,
      });
    } else {
      guild.bump.enabled = false;
      await guild.save();
      return message.reply({
        title: `Bump Reminder`,
        description: `Bump reminder was successfully disabled!`,
      });
    }
  },
};
