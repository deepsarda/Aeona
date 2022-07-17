module.exports = {
  name: "config",
  description: "Configure the bot to your liking",
  usage: "+config",
  category: "config",
  aliases: [
    "settings",
    "welcome",
    "leave",
    "logging",
    "modlog",
    "autorole",
    "altdetector",
    "tickets",
    "suggestions",
    "reports",
    "automod",
  ],
  permission: ["MANAGE_GUILD"],
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    return message.reply({
      title: "Config",
      description: `This is a list of all the commands that can be used to configure the bot. \n **Main Settings**  \[Click here\]\(${process.env.domain}/dashboard/${message.guild.id}) \n **Welcome & Leave** \[Click here\]\(${process.env.domain}/dashboard/${message.guild.id}/welcome) \n **Logging** \[Click here\]\(${process.env.domain}/dashboard/${message.guild.id}/logging) \n **Autorole** \[Click here\]\(${process.env.domain}/dashboard/${message.guild.id}/autorole)\n **Alt Detector** \[Click here\]\(${process.env.domain}/dashboard/${message.guild.id}/altdetector) \n **Tickets** \[Click here\]\(${process.env.domain}/dashboard/${message.guild.id}/tickets)\n **Suggestions** \[Click here\]\(${process.env.domain}/dashboard/${message.guild.id}/Suggestions) \n **Automod** [Click here](${process.env.domain}/dashboard/${message.guild.id}/automod)`,
    });
  },
};
