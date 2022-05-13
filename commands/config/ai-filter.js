const Command = require("../../structures/Command");
const Guild = require("../../database/schemas/Guild");
const { MessageEmbed } = require("discord.js");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "ai-filter",
      aliases: ["aifilter", "filter"],
      description:
        "Automatically filter the messages that come in order to stay within the Discord TOS.",
      category: "Config",
      usage: ["<enable | disable>"],
      examples: ["anti-invites enable", "anti-invites disable"],
      cooldown: 3,
      userPermission: ["MANAGE_GUILD"],
    });
  }

  async run(message, args) {
    const guildDB = await Guild.findOne({
      guildId: message.guild.id,
    });

    if (!guildDB)
      return message.channel.send("This guild is not in the database.");

    if (guildDB.isPremium === "false") {
      return message.channel.send(
        "This guild is not premium. \n Get premium for free at https://Aeona.xyz/reedem"
      );
    }
    if (args.length < 1) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(message.guild.me.displayHexColor)
            .setDescription(
              `${message.client.emoji.fail} You need to specify whether you want to enable or disable the AI filter. \`aeona aifilter enable\` or \`aeona aifilter disable\``
            ),
        ],
      });
    }

    if (
      !message.content.includes("enable") &&
      !message.content.includes("disable")
    ) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(message.guild.me.displayHexColor)
            .setDescription(
              `${message.client.emoji.fail} ${language.antiinvites1}`
            ),
        ],
      });
    }

    if (args.includes("disable")) {
      if (guildDB.aiAutoMod === false)
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(message.guild.me.displayHexColor)
              .setDescription(
                `${message.client.emoji.fail} AI filter is already disabled.`
              ),
          ],
        });

      await Guild.findOne(
        {
          guildId: message.guild.id,
        },
        async (err, guild) => {
          guild
            .updateOne({
              aiAutoMod: false,
            })
            .catch((err) => console.error(err));

          return message.channel.send({
            embeds: [
              new MessageEmbed()
                .setColor(message.guild.me.displayHexColor)
                .setDescription(
                  `${message.client.emoji.success} Successfully disabled the AI filter.`
                ),
            ],
          });
        }
      );
      return;
    }

    if (args.includes("enable")) {
      if (guildDB.aiAutoMod === true)
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(message.guild.me.displayHexColor)
              .setDescription(
                `${message.client.emoji.fail} Successfully enabled the AI filter.`
              ),
          ],
        });

      await Guild.findOne(
        {
          guildId: message.guild.id,
        },
        async (err, guild) => {
          guild
            .updateOne({
              aiAutoMod: true,
            })
            .catch((err) => console.error(err));

          return message.channel.send({
            embeds: [
              new MessageEmbed()
                .setColor(message.guild.me.displayHexColor)
                .setDescription(
                  `${message.client.emoji.success} Successfully enabled the AI filter.`
                ),
            ],
          });
        }
      );
      return;
    }
  }
};
