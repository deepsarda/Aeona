const Command = require("../../structures/Command");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "skip",
      description: "Skip the current song.",
      category: "Music",
      cooldown: 3,
    });
  }
  async run(message, args) {
    if (!message.client.musicManager.get(message.guild.id))
      return message.channel.send("🚫 No music is being played!");
    if (!message.member.voice?.channelId)
      return message.channel.send("🚫 You need to be in my voice channel!");
    if (
      message.member.voice.channelId !==
      message.client.musicManager.get(message.guild.id).voiceChannel
    )
      return message.channel.send("🚫 You're not in the same voice channel!");

    const response = skip(message);
    message.reply(response);
  }
};

function skip({ client, guildId }) {
  const player = client.musicManager.get(guildId);
  const { title } = player.queue.current;
  player.stop();
  return `⏯️ ${title} was skipped.`;
}
