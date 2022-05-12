const Command = require("../../structures/Command");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "resume",
      aliases: ["unpause", "unstop"],
      description: "Resume the current song.",
      category: "Music",
      cooldown: 3,
      usage: "",
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

    const response = resumePlayer(message);
    message.reply(response);
  }
};
function resumePlayer({ client, guildId }) {
  const player = client.musicManager.get(guildId);
  if (!player.paused) return "The player is already resumed";
  player.pause(false);
  return "▶️ Resumed the music player";
}
