const Discord = require("discord.js");

const AFKModel = require("../../dashboard/models/afk.js");

module.exports = {
  name: "messageCreate",
  async execute(client,message) {
    // Searching for AFK user mentions

    if (message.mentions.members.size > 0) {
      for (const member of message.mentions.members.values()) {
        const afk = await AFKModel.findOne({
          userID: member.id,
          guildID: message.guild.id,
        }).exec();

        if (!afk) continue;

        await message.channel.send({
          title: `${member.displayName} is AFK!`,
          description: `${member} is AFK.\nStatus: ${afk.message}`,
        });
      }
    }

    // Searching for AFK users

    const afk = await AFKModel.findOne({
      userID: message.author.id,
      guildID: message.guild.id,
    }).exec();

    if (afk) {
      await message.channel.send({
        title: "Removed AFK status!",
        description: `Welcome back ${message.member}, I've cleared your AFK.`,
        thumbnailURL: message.member.displayAvatarURL({ dynamic: true }),
      });

      await AFKModel.deleteOne({
        userID: message.author.id,
        guildID: message.guild.id,
      }).exec();
    }

    // Searching for a command

    let prefixes = [
      "+",
      ">",
      "aeona",
      `<@${message.client.user.id}>`,
      `<@!${message.client.user.id}>`,
    ];

    let prefix;

    if (message.mentions.repliedUser) {
      if (message.mentions.repliedUser.id === message.client.user.id) {
        prefix = "";
      }
    }

    for (let p of prefixes) {
      if (message.content.startsWith(p)) {
        prefix = p;
        break;
      }
    }

    if (!prefix) return;

    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let command = args.shift().toLowerCase();

    let cmd;

    if (message.client.commands.has(command)) {
      cmd = message.client.commands.get(command);
      try {
        if (args.length < cmd.requiredArgs)
          return await message.channel.sendError({
            title: "Invalid Usage!",
            description: `Correct Usage: \`${cmd.usage}\`\nPlease retry this command.`,
          });
        const player = message.client.manager.get(message.guild.id);
        const embed = new Discord.MessageEmbed().setColor("RED");

        if (cmd.player && !player) {
          embed.setDescription("There is no player for this guild.");
          return message.channel.send({ embeds: [embed] });
        }
        if (
          cmd.permission &&
          !message.member.permissions.has(command.permission)
        ) {
          embed.setDescription("You can't use this command.");
          return message.channel.send({ embeds: [embed] });
        }
        if (
          !message.channel
            .permissionsFor(message.guild.me)
            ?.has(Discord.Permissions.FLAGS.EMBED_LINKS) &&
          client.user.id !== userId
        ) {
          return channel.send({
            content: `Error: I need \`EMBED_LINKS\` permission to work.`,
          });
        }

        if (cmd.inVoiceChannel && !message.member.voice.channelId) {
          embed.setDescription("You must be in a voice channel!");
          return message.channel.send({ embeds: [embed] });
        }

        if (cmd.sameVoiceChannel) {
          if (message.guild.me.voice.channel) {
            if (
              message.guild.me.voice.channelId !==
              message.member.voice.channelId
            ) {
              embed.setDescription(
                `You must be in the same channel as ${message.client.user}!`
              );
              return message.channel.send({ embeds: [embed] });
            }
          }
        }

        await cmd.execute(message, args, message.client, prefix);
        console.log(
          `${message.author.tag} ran command ${cmd.name} in ${
            message.guild.name
          } (${message.guild.id}) in channel ${message.channel.name} (${
            message.channel.id
          }) with args ${args.join(" ")} userId: ${message.author.id}`
        );
      } catch (e) {
        console.error(e);
        message.reply({
          title: "Error",
          description: `Hey,${message.author}! Something went wrong! \n \`\`\`js ${e} \`\`\``,
        });
      }
    }
  },
};
