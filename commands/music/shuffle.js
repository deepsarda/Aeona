const Command = require("../../structures/Command");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "shuffle",
      description: "Shuffle the queue.",
      category: "Music",
      cooldown: 3,
      usage: "",
    });
  }
  async run(message, args, bot) {
    if (!message.client.musicManager.get(message.guild.id))
      return message.channel.send("🚫 No music is being played!");
    if (!message.member.voice?.channelId)
      return message.channel.send("🚫 You need to be in my voice channel!");
    if (
      message.member.voice.channelId !==
      message.client.musicManager.get(message.guild.id).voiceChannel
    )
      return message.channel.send("🚫 You're not in the same voice channel!");

    const response = shuffle(message);
    message.reply(response);
  }
};

function shuffle({ client, guildId }) {
  const player = client.musicManager.get(guildId);
  player.queue.shuffle();
  return "🎶 Queue has been shuffled";
}
