const { MessageEmbed } = require("discord.js");
require("moment-duration-format");
const Db = require("../../packages/reactionrole/models/schema.js");
const reactionTicket = require("../../database/schemas/tickets.js");
const Logging = require("../../database/schemas/logging");
const Snipe = require("../../database/schemas/snipe");

module.exports = {
  name: "messageDelete",
  async execute(client, message) {
    if (!message.guild) return;
    let snipe = await Snipe.findOne({
      guildId: message.guild.id,
      channel: message.channel.id,
    });

    const logging = await Logging.findOne({ guildId: message.guild.id });
    if (message && message.author && !message.author.bot) {
      if (!snipe) {
        const snipeSave = new Snipe({
          guildId: message.guild.id,
          channel: message.channel.id,
        });

        snipeSave.message.push(message.content || null);
        snipeSave.tag.push(message.author.id);
        snipeSave.image.push(
          message.attachments.first()
            ? message.attachments.first().proxyURL
            : null
        );

        snipeSave.save().catch(() => {});

        snipe = await Snipe.findOne({
          guildId: message.guild.id,
          channel: message.channel.id,
        });
      } else {
        if (snipe.message.length > 4) {
          snipe.message.splice(-5, 1);
          snipe.tag.splice(-5, 1);
          snipe.image.splice(-5, 1);

          snipe.message.push(message.content || null);
          snipe.tag.push(message.author.id);
          snipe.image.push(
            message.attachments.first()
              ? message.attachments.first().proxyURL
              : null
          );
        } else {
          snipe.message.push(message.content || null);
          snipe.tag.push(message.author.id);
          snipe.image.push(
            message.attachments.first()
              ? message.attachments.first().proxyURL
              : null
          );
        }

        snipe.save().catch(() => {});
      }
    }

    if (logging) {
      if (logging.message_events.toggle == "true") {
        if (logging.message_events.ignore == "true") {
        }

        const channelEmbed = await message.guild.channels.cache.get(
          logging.message_events.channel
        );

        if (channelEmbed) {
          let color = logging.message_events.color;
          if (color == "#000000") color = "RED";

          if (logging.message_events.deleted == "true") {
            const embed = new MessageEmbed()
              .setAuthor(
                `${message.author.tag} | Message Deleted`,
                message.author.displayAvatarURL({ dynamic: true })
              )
              .setTimestamp()
              .setFooter({ text: `ID: ${message.id}` })
              .setColor(message.guild.me.displayHexColor);

            if (message.content) {
              if (message.content.length > 1024)
                message.content = message.content.slice(0, 1021) + "...";

              embed
                .setDescription(
                  `${message.member}'s message got deleted in ${message.channel}`
                )
                .addField("Message", message.content);
            } else {
              embed.setDescription(
                `${message.member} deleted an **embed** in ${message.channel}`
              );
            }
            let embeds = [embed];
            embeds = embeds.concat(message.embeds);
            if (
              channelEmbed &&
              channelEmbed.viewable &&
              channelEmbed
                .permissionsFor(message.guild.me)
                .has(["SEND_MESSAGES", "EMBED_LINKS"])
            ) {
              channelEmbed.send({
                embeds,
              });
            }
          }
        }
      }
    }
  },
};
