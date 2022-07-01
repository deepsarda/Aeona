const Discord = require("discord.js");
const Guild = require("../../database/schemas/Guild");
const Logging = require("../../database/schemas/logging");
const welcomeClient = new Discord.WebhookClient({
  url: process.env.importantLogs,
});
module.exports = {
  name: "guildCreate",
  async execute(client, guild) {
    console.log(`Joined to "${guild.name}" (${guild.id})`, { label: "Guilds" });

    const find = await Guild.findOne({
      guildId: guild.id,
    });

    if (!find) {
      const guildConfig = await Guild.create({
        guildId: guild.id,
        language: "english",
      });
      await guildConfig.save().catch(() => {});
    }

    let textChats = guild.channels.cache.find(
      (ch) =>
        ch.type === "text" &&
        ch
          .permissionsFor(guild.me)
          .has(["SEND_MESSAGES", "VIEW_CHANNEL", "EMBED_LINKS"])
    );

    const modLog = guild.channels.cache.find(
      (c) =>
        c.name.replace("-", "").replace("s", "") === "modlog" ||
        c.name.replace("-", "").replace("s", "") === "moderatorlog"
    );

    let muteRole = guild.roles.cache.find(
      (r) => r.name.toLowerCase() === "muted"
    );
    if (!muteRole) {
      try {
        muteRole = await guild.roles.create({
          data: {
            name: "Muted",
            permissions: [],
          },
        });
      } catch {}
      for (const channel of guild.channels.cache.values()) {
        try {
          if (
            channel.viewable &&
            channel.permissionsFor(guild.me).has("MANAGE_ROLES")
          ) {
            if (channel.type === "GUILD_TEXT")
              await channel.permissionOverwrites.edit(muteRole, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false,
              });
            else if (channel.type === "GUILD_VOICE" && channel.editable)
              //
              await channel.permissionOverwrites.edit(muteRole, {
                SPEAK: false,
                STREAM: false,
              });
          }
        } catch (err) {}
      }
    }

    const logging = await Logging.findOne({
      guildId: guild.id,
    });
    if (!logging) {
      const newL = await Logging.create({
        guildId: guild.id,
      });
      await newL.save().catch(() => {});
    }

    const logging2 = await Logging.findOne({
      guildId: guild.id,
    });

    if (logging2) {
      if (muteRole) {
        logging2.moderation.mute_role = muteRole.id;
      }

      if (modLog) {
        logging2.moderation.channel = modLog.id;
      }
      await logging2.save().catch(() => {});
    }

    if (textChats) {
      const embed = new Discord.MessageEmbed()
        .setColor("PURPLE")
        .setDescription(
          `Hey Discorders! I'm **Aeona**.\n\nThank you for inviting me to your server as it means a lot to us! You can get started with [\`+help\`](${process.env.domain}) & customise your server settings by accessing the Dashboard [\`here\`](https://Aeona.xyz/dashboard/${guild.id}).\n\n__**Current News**__\n\`\\n\nAgain, thank you for inviting me! \n**- Aeona**`
        )
        .addField(
          "\u200b",
          `**[Invite](${process.env.domain}/invite) | ` +
            `[Support Server](${process.env.domain}/support) | ` +
            `[Dashboard](${process.env.domain}/dashboard)**`
        );

      textChats.send({ embeds: [embed] }).catch(() => {});
    }
    let owner = await guild.fetchOwner();
    const welcomeEmbed = new Discord.MessageEmbed()
      .setColor(`PURPLE`)
      .setTitle("New Server")
      .setThumbnail(`${process.env.domain}/logo`)
      .setDescription(`Aeona was added to a new Server!`)
      .addField(`Server Name`, `\`${guild.name}\``, true)
      .addField(`Server ID`, `\`${guild.id}\``, true)
      .addField(`Server Owner`, `\`${owner.user.tag}\``, true)
      .addField(`Server Owner ID`, `\`${owner.user.id}\``, true)
      .setFooter({
        text: `${this.client.guilds.cache.size} guilds `,
        iconURL: `${process.env.domain}/logo.png`,
      });

    welcomeClient.send({
      username: "Aeona",
      avatarURL: `${process.env.domain}/logo.png`,
      embeds: [welcomeEmbed],
      content: "@everyone",
    });
  },
};
