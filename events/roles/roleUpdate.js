const Logging = require("../../database/schemas/logging");
const discord = require("discord.js");
const moment = require("moment");

module.exports = {
  name: "roleUpdate",
  async execute(client, oldRole, newRole) {
    if (!newRole) return;
    if (newRole.managed) return;
    const logging = await Logging.findOne({ guildId: oldRole.guild.id });

    if (logging) {
      if (logging.server_events.toggle == "true") {
        const channelEmbed = await newRole.guild.channels.cache.get(
          logging.server_events.channel
        );

        if (channelEmbed) {
          let color = logging.server_events.color;
          if (color == "#000000") color = "GREEN";

          if (logging.server_events.role_update == "true") {
            const embed = new discord.MessageEmbed()
              .setDescription(`:pencil: ***Role Updated***`)

              .setFooter({ text: `Role ID: ${newRole.id}` })
              .setTimestamp()
              .setColor(color);

            if (oldRole.name !== newRole.name) {
              embed.addField(
                "Name Update",
                `${oldRole.name} --> ${newRole.name}`,
                true
              );
            } else {
              embed.addField("Name Update", `Name not updated`, true);
            }
            function makehex(rgb) {
              let hex = Number(rgb).toString(16);
              if (hex.length < 2) {
                hex = "0" + hex;
              }
              return hex;
            }

            if (oldRole.color !== newRole.color) {
              embed.addField(
                "Color Update",
                `#${makehex(oldRole.color)} --> #${makehex(newRole.color)}`,
                true
              );
            }

            if (oldRole.mentionable !== newRole.mentionable) {
              embed.addField(
                "mentionable",
                `${oldRole.mentionable} --> ${newRole.mentionable}`,
                true
              );
            }

            if (
              channelEmbed &&
              channelEmbed.viewable &&
              channelEmbed
                .permissionsFor(newRole.guild.me)
                .has(["SEND_MESSAGES", "EMBED_LINKS"])
            ) {
              channelEmbed.send({ embeds: [embed] }).catch(() => {});
            }
          }
        }
      }
    }
  },
};
