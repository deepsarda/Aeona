const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");

module.exports = class extends Command {
  constructor(...args) { 
    super(...args, {
      name: "create-backup",
      aliases: ["createbackup", "backup", "backup-create"],
      description: "Create server backup",
      category: "Config",
      cooldown: 3,
      userPermission: ["ADMINISTRATOR"],
      botPermission: ["ADMINISTRATOR"],
    });
  }

  async run(message, args) {
    const wait = new MessageEmbed() // Prettier
      .setColor("#5865f2")
      .setDescription(
        ` Please wait... I'm generating server backup! It may even take a few minutes!`
      );
    message.reply({ embeds: [wait] }).then((msg) => {
      client.backupManager
        .create(message.guild, {
          maxMessagesPerChannel: 1000,
          jsonBeautify: true,
          saveImages: "base64",
        })
        .then((backupData) => {
          const embed = new MessageEmbed() // Prettier
            .setColor("GREEN")
            .setTitle(`${client.bot_emojis.success} Backup Created!`)
            .setDescription(
              `>>>  Backup ID: \`${backupData.id}\`\n Use \`+load-backup\` to load the backup!\n\nTip: You can load the backup on the same server or even on another guild!`
            );
          return msg.edit({ embeds: [embed] });
        });
    });
  }
};
 