const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "backup-info",
      aliases: ["backupinfo"],
      description: "Get information about a particular backup",
      category: "Config",
      cooldown: 3,
      usage: "",
    });
  }

  async run(message, args) {
    const backupID = args.join(" ");

    if (!backupID) {
      return message.channel.send(`Please specify a backup ID!`);
    }

    client.backupManager
    .fetch(backupID)
    .then((backup) => {
     const embed = new MessageEmbed()
      .setDescription(`>  Server name: ${backup.data.name}\n>  Backup ID: \`${backup.id}\`\n>  Backup size: \`${backup.size}kb\`\n>  Created at: <t:${parseInt(backup.data.createdTimestamp / 1000)}> (<t:${parseInt(backup.data.createdTimestamp / 1000)}:R>)\n\n> Note: You can load the backup by running \`${client.prefix} load-backup ${backup.id}\`!`)
      .setAuthor({ name: `#${backup.id}`, iconURL: backup.data.iconURL })
      .setThumbnail(backup.data.iconURL)
      .setColor("4f545c")
      .setFooter("Backup ID: " + backup.id)
      .setFooter({
       text: `Requested by ${message.author.username}`,
       iconURL: message.author.displayAvatarURL({
        dynamic: true,
        format: "png",
        size: 2048,
       }),
      });
     return message.reply({ embeds: [embed] });
    });
  }
};
