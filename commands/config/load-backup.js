const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "load-backup",
      aliases: ["load-server-backup", "lbackup", "l-backup", "backup-load"],
      description: "Load a server backup",
      category: "Config",
      userPermission: ["ADMINISTRATOR"],
      botPermission: ["ADMINISTRATOR"],
    });
  }

  async run(message, args) {
    const backupID = args.join(" ");
    if (!backupID) {
      return message.channel.send(`Please specify a backup ID!`);
    }

    let client = message.client;
    client.backupManager.fetch(backupID).then(() => {
      const msg = new MessageEmbed() // Prettier
        .setColor("RED")
        .setAuthor({ name: "Warning!" })
        .setDescription(
          ":warning: | All the server channels, roles, and settings will be cleared. Do you want to continue? Send `-confirm` or `cancel`!"
        )
        .setFooter("You have 15s to reply!", message.author.displayAvatarURL());
      message.reply({ embeds: [msg] });
      const filter = (m) =>
        (m.author.id === message.author.id && m.content.includes("-confirm")) ||
        (m.author.id === message.author.id && m.content.includes("cancel"));
      const collector = message.channel.createMessageCollector({
        filter,
        time: 15000,
        max: 1,
      });
      collector.on("collect", (m) => {
        collector.stop();
        if (m.content == "-confirm") {
          const wait = new MessageEmbed() // Prettier
            .setColor("#5865f2")
            .setDescription(
              ` Please wait... I'm loading server backup! It may even take a few minutes!`
            );
          message.channel.send({ embeds: [wait] });
          client.backupManager
            .load(backupID, message.guild)
            .then(() => {
              return message.author.send("Backup loaded successfully!");
            })
            .catch((err) => {
              if (err === "No backup found") {
                return client.createError(
                  message,
                  ` No backup found for ID \`${backupID}\`!`
                );
              } else {
                const error = new MessageEmbed()
                  .setColor("RED")
                  .setTitle(` A wild error appeared!`)
                  .setDescription(
                    `>>> \`\`\`${
                      err.toString().slice(0, 1000) ||
                      `Something went wrong... `
                    }\`\`\``
                  );
                return message.author.send({ embeds: [error] });
              }
            });
        } else {
            return message.channel.send("Backup loading cancelled!");
        }
      });

      collector.on("end", (collected, reason) => {
        if (reason === "time")
          return message.channel.send(`This command has expired!`);
      });
    });
  }
};
