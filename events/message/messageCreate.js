const Discord = require("discord.js");

module.exports = {
  name: "messageCreate",
  async execute(message) {
    let prefixes = [
      "+",
      ">",
      "aeona",
      `<@${message.client.user.id}>`,
      `<@!${message.client.user.id}>`,
    ];

    let prefix;

    if (message.mentions.repliedUser) {
      if (message.mentions.repliedUser.id === message.client.user.id) {
        prefix = "";
      }
    }

    for (let p of prefixes) {
      if (message.content.startsWith(p)) {
        prefix = p;
        break;
      }
    }

    if (!prefix) return;

    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let command = args.shift().toLowerCase();

    let cmd;

    if (message.client.commands.has(command)) {
      cmd = message.client.commands.get(command);
    }
    try {
      await cmd.execute(message, args, message.client, prefix);
    } catch (e) {
      console.error(e);
      message.reply(
        `Hey,${message.author}! Something went wrong! \n \`\`\`js ${e} \`\`\``
      );
    }
  },
};
