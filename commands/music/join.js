const { MessageEmbed, Permissions } = require("discord.js");

module.exports = {
  name: "join",
  aliases: ["j"],
  category: "music",
  description: "Join voice channel",
  requiredArgs: 0,
  usage: "+join",
  permission: [],

  player: false,
  inVoiceChannel: true,
  sameVoiceChannel: false,
  execute: async (message, args, client, prefix) => {
    let player = message.client.manager.get(message.guildId);
    if (player && player.voiceChannel && player.state === "CONNECTED") {
      return await message.channel.send({
        embeds: [
          new MessageEmbed().setDescription(
            `I'm already connected to <#${player.voiceChannel}> voice channel!`
          ),
        ],
      });
    } else {
      if (
        !message.guild.me.permissions.has([
          Permissions.FLAGS.CONNECT,
          Permissions.FLAGS.SPEAK,
        ])
      )
        return message.channel.send({
          embeds: [
            new MessageEmbed().setDescription(
              `I don't have enough permissions to execute this command! please give me permission \`CONNECT\` or \`SPEAK\`.`
            ),
          ],
        });

      const { channel } = message.member.voice;

      if (
        !message.guild.me
          .permissionsIn(channel)
          .has([Permissions.FLAGS.CONNECT, Permissions.FLAGS.SPEAK])
      )
        return message.channel.send({
          embeds: [
            new MessageEmbed().setDescription(
              `I don't have enough permissions connect your vc please give me permission \`CONNECT\` or \`SPEAK\`.`
            ),
          ],
        });

      const emojiJoin = message.client.emoji.join;

      player = message.client.manager.create({
        guild: message.guild.id,
        voiceChannel: channel.id,
        textChannel: message.channel.id,
        volume: 80,
        selfDeafen: true,
      });
      if (player && player.state !== "CONNECTED") player.connect();

      let thing = new MessageEmbed().setDescription(
        `${emojiJoin} **Join the voice channel**\nJoined <#${channel.id}> and bound to <#${message.channel.id}>`
      );
      return message.reply({ embeds: [thing] });
    }
  },
};
