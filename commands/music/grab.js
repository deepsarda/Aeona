const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const { convertTime } = require("../../utils/convert.js");

module.exports = {
  name: "grab",
  aliases: ["save"],
  category: "music",
  description: "Grabs And Sends You The Song That Is Playing At The Moment",
  requiredArgs: 0,
  usage: "+grab",
  permission: [],

  player: true,
  inVoiceChannel: true,
  sameVoiceChannel: false,
  execute: async (message, args, client, prefix) => {
    const player = message.client.manager.get(message.guild.id);

    if (!player.queue.current) {
      let thing = new MessageEmbed()
        .setColor("#FFC942")
        .setDescription("> There is no music playing.");
      return message.channel.send({ embeds: [thing] });
    }

    const song = player.queue.current;
    const total = song.duration;
    const current = player.position;

    const dmbut = new MessageButton()
      .setLabel("Check Your Dm")
      .setStyle("LINK")
      .setURL(`https://discord.com/users/${client.id}`);
    const row = new MessageActionRow().addComponents(dmbut);

    let dm = new MessageEmbed()
      .setAuthor({
        name: message.member.tag,
        iconURL: message.member.avatarURL(),
      })
      .setDescription(`:mailbox_with_mail: \`Check Your Dms!\``)

      .setFooter({ text: `Requested By ${message.member.tag}` })
      .setTimestamp();
    message.reply({ embeds: [dm], components: [row] });

    const urlbutt = new MessageButton()
      .setLabel("Search")
      .setStyle("LINK")
      .setURL(song.uri);
    const row2 = new MessageActionRow().addComponents(urlbutt);
    let embed = new MessageEmbed()
      .setDescription(
        `**Song Details** \n\n > **__Song Name__**: [${song.title}](${
          song.uri
        }) \n > **__Song Duration__**: \`[${convertTime(
          song.duration
        )}]\` \n > **__Song Played By__**: [<@${
          song.requester.id
        }>] \n > **__Song Saved By__**: [<@${message.member.id}>]`
      )
      .setThumbnail(song.displayThumbnail())

      .addField(
        "\u200b",
        `\`${convertTime(current)} / ${convertTime(total)}\``
      );
    return message.member.send({ embeds: [embed], components: [row2] });
  },
};
