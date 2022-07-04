module.exports = {
  name: "uptime",
  description: "View the bot's uptime",
  aliases: [],
  usage: "+uptime",
  category: "info",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    let uptime = this.client.uptime;
    if (uptime instanceof Array) {
      uptime = uptime.reduce((max, cur) => Math.max(max, cur), -Infinity);
    }
    let seconds = uptime / 1000;
    let days = parseInt(seconds / 86400);
    seconds = seconds % 86400;
    let hours = parseInt(seconds / 3600);
    seconds = seconds % 3600;
    let minutes = parseInt(seconds / 60);
    seconds = parseInt(seconds % 60);

    uptime = `${seconds}s`;
    if (days) {
      uptime = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
    } else if (hours) {
      uptime = `${hours} hours, ${minutes} minutes and ${seconds} seconds`;
    } else if (minutes) {
      uptime = `${minutes} minutes and ${seconds} seconds`;
    } else if (seconds) {
      uptime = `${seconds} seconds`;
    }

    return message.reply({
      title: "Uptime",
      description: `${message.guild.me.displayName}'s uptime is ${uptime}.`,
    });
  },
};
