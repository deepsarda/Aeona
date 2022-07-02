module.exports = {
  name: "ping",
  description: "View the bot's latency",
  aliases: ["latency"],
  usage: "+ping",
  category: "info",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    let ping = Math.round(message.client.ws.ping);
    let msg = await message.channel.send(`Pong! \`${ping}ms\``);
    msg.delete();

    const latency = msg.createdTimestamp - message.createdTimestamp;
    message.channel.send({
      title: "Pong",
      description: `**Discord API:** ${ping}ms \n**Bot Latency:** ${latency}ms`,
    });
  },
};
