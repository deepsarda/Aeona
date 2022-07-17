const Discord = require("discord.js");
let ratelimits = new Discord.Collection();
const Guild = require("../../database/schemas/Guild");
const User = require("../../database/schemas/User");
const Moderation = require("../../database/schemas/logging");
const Blacklist = require("../../database/schemas/blacklist");
let autoResponseCooldown = new Set();

const executeChatBot = require("../../utils/chatbot");
const customCommands = require("../../utils/customCommands");
const globalchat = require("../../utils/globalchat");
const afkCheck = require("../../utils/afkCheck");
const autoresponse = require("../../utils/autoresponse");
const Levels = require("discord-xp");
let xpCooldown = new Set();
const { CanvasSenpai } = require("canvas-senpai");
const { channel } = require("diagnostics_channel");
const canva = new CanvasSenpai();


module.exports = {
  name: "messageCreate",
  async execute(client, message) {
    if (!message.guild) {
      if (message.author.bot) return;
      let prefixes = [
        "+",
        ">",
        "aeona",
        `<@${message.client.user.id}>`,
        `<@!${message.client.user.id}>`,
      ];

      let prefix = "";
      for (let p of prefixes) {
        if (message.content.toLowerCase().startsWith(p)) {
          prefix = p;
          break;
        }
      }

      return executeChatBot(message, prefix, 0, "deepparag/Aeona");
    }

    let settings = await Guild.findOne({
      guildId: message.guild.id,
    });

    if (!settings) {
      settings = new Guild({
        guildId: message.guild.id,
        prefix: "+",
      });
      await settings.save();
    }

    if (message.author.bot) {
      if (message.embeds.length &&
        message.author.username == 'DISBOARD' &&
        message.embeds[ 0 ].description.indexOf("Bump done") > -1) {
          if (settings.bump.enabled) {
            message.channel.send(
              `<@${message.author.id}> has bumped the server! Thank you for your contribution to this server! \n We shall remind you to bump in 2 hours!`
            );
            settings.bump.lastBump = Date.now();
          }
        }
      }
    }

    if (settings.leveling.enabled) {
      if (!xpCooldown.has(message.author.id)) {
        const randomAmountOfXp = Math.floor(Math.random() * 29) + 1; // Min 1, Max 30
        const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomAmountOfXp);
        let user = await Levels.fetch(message.member.id, message.guild.id, true); // Selects the target from the database.
        let channel = message.channel;
        if (settings.leveling.levelUpChannel) {
          channel = await message.guild.channels.fetch(settings.leveling.levelUpChannel).catch(() => { });
          if (!channel) {
            channel = message.channel;
          }
        }

        if (hasLeveledUp) {



          let levelUpMessage = settings.leveling.levelUpMessage;
          levelUpMessage = levelUpMessage.replace("{user}", message.member);
          levelUpMessage = levelUpMessage.replace("{level}", user.level);
          levelUpMessage = levelUpMessage.replace("{xp}", user.cleanXp);
          levelUpMessage = levelUpMessage.replace("{requiredXp}", user.cleanNextLevelXp);
          levelUpMessage = levelUpMessage.replace("{rank}", user.position);

          let data = await canva.profile({
            name: message.author.username,
            discriminator: message.author.discriminator,
            avatar: message.member.displayAvatarURL({ format: "png" }),
            background: message.member.banner
              ? message.member.bannerURL({ format: "png", size: 4096 })
              : null,
            rank: 1,
            xp: user.cleanXp,
            level: user.level,
            maxxp: user.cleanNextLevelXp,
            blur: false,
          });

          const attachment = new Discord.MessageAttachment(data, "profile.png");
          channel.send({ content: levelUpMessage, embeds:[],files: [attachment] });
        }

        for (let i = 0; i < settings.leveling.roles.length; i++) {
          if (user.level == settings.leveling.roles[i].level) {
            try {
              let role = await message.guild.roles.fetch(settings.leveling.roles[i].role).catch(() => { });

              if (!role) {
                channel.send(`${message.author} I was unable to give you the reward for reaching level ${user.level}! As I was unable to find the role. Please contact a server admin to have the role given to you.`);
                break;
              }
              message.member.roles.add(settings.leveling.roles[i].role);

              channel.send(`${message.author} has reached level ${user.level} and has been given the role ${role.name}`);
            } catch (e) {
              channel.send(`${message.author} I was unable to give you the reward for reaching level ${user.level}! As my role is not high enough. Please contact a server admin to have the role given to you.`);
            }
          }
        }
        xpCooldown.add(message.author.id);
        setTimeout(() => {
          xpCooldown.delete(message.author.id);
        }, 5000);
      }
    }
    globalchat(settings, message, client);
    afkCheck(settings, message, client);

    let a = await autoresponse(message, autoResponseCooldown);
    autoResponseCooldown = a.cooldown;
    if (a.success) return;

    if (settings.aiAutoMod) {
      //fetch https://Toxicity.aeona.repl.co  with sentence?=${message.content} and if response does not contain "No" then delete message and tell the user
      let toxicity = await fetch(
        `https://Toxicity.aeona.repl.co/?sentence=${message.content}`
      );
      let toxicityText = await toxicity.text();

      if (!toxicityText.includes("No")) {
        message.delete();
        message.channel
          .send(
            `<@${message.author.id}> Your message has been deleted for being ${toxicityText}.`
          )
          .then(async (s) => {
            setTimeout(() => {
              s.delete().catch(() => { });
            }, 5000);
          })
          .catch(() => { });
      }
    }
    if (settings && (await inviteFilter(settings, message, client))) return;
    if (settings && (await linkFilter(settings, message, client))) return;

    let mainPrefix = settings ? settings.prefix : "+";

    let prefixes = [
      mainPrefix,
      mainPrefix == "+" ? ">" : null,
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

    if (settings.chatbot.alwaysOnChannel == message.channel.id) prefix = "";

    for (let p of prefixes) {
      if (message.content.toLowerCase().startsWith(p)) {
        prefix = p;
        break;
      }
    }

    if (prefix === undefined) return;

    if (message.author.bot) return;


    let userData= await User.findOne({ discordId: message.author.id});
    if(!userData){
      userData = new User({
        discordId: message.author.id,
      });
      await userData.save();
    }

    if(userData.version !== client.version){
      userData.version = client.version;
      message.reply(client.updateLog[client.version]);

      await userData.save();
    }


    const moderation = await Moderation.findOne({
      guildId: message.guild.id,
    });

    if (!moderation) {
      Moderation.create({
        guildId: message.guild.id,
      });
    }

    const userBlacklistSettings = await Blacklist.findOne({
      discordId: message.author.id,
    });
    if (userBlacklistSettings && userBlacklistSettings.isBlacklisted) return;

    let args = message.content.slice(prefix.length).trim().split(" ");
    let command = args.shift().toLowerCase();

    if (!command || command == "")
      return message.channel.send({
        title: "Hello, I am Aeona",
        description:
          "I am an Intellegent Multipurpose AI Chatbot, I am here to help you with your server.\n\nTo get started, type `+help` ",
        imageURL:
          "https://cdn.discordapp.com/attachments/982536937996959784/982560515052175370/chatbot.gif?size=4096",
      });

    let cmd;
    if (await customCommands(message, command)) return;

    const disabledCommands = settings.disabledCommands;
    if (typeof disabledCommands === "string")
      disabledCommands = disabledCommands.split(" ");

    if (message.client.commands.has(command.trim().toLowerCase())) {
      cmd = message.client.commands.get(command);

      const rateLimit = ratelimit(message, cmd);

      if (typeof rateLimit === "string")
        return message.channel
          .send(
            `Please wait **${rateLimit}** before running the **${cmd}** command again - ${message.author
            }\n\n${number === 1
              ? `*Did You know that Aeona has its own dashboard? ${process.env.domain}/dashboard*`
              : ""
            }${number === 2
              ? `*You can check our top.gg page at ${process.env.domain}*`
              : ""
            }`
          )
          .then((s) => {
            message.delete().catch(() => { });

            setTimeout(() => {
              s.delete().catch(() => { });
            }, 10000);
          })
          .catch(() => { });

      try {
        if (args.length < cmd.requiredArgs)
          return await message.channel.sendError({
            title: "Invalid Usage",
            description: `Correct Usage: \`${cmd.usage}\`\nPlease retry this command.`,
          });
        const player = message.client.manager.get(message.guild.id);

        if (cmd.player && !player) {
          return message.channel.sendError({
            description: `There is no player for this guild.`,
          });
        }
        if (
          cmd.permissions &&
          !message.client.developers.includes(message.author.id) &&
          !message.member.permissions.has(command.permission[0])
        ) {
          return message.channel.sendError({
            description: ` You can't use this command.`,
          });
        }

        if (cmd.botPermission) {
          const missingPermissions = message.channel
            .permissionsFor(message.guild.me)
            .missing(cmd.botPermission)
            .map((p) => permissions[p]);

          if (missingPermissions.length !== 0) {
            return message.channel
              .sendError({
                msg: message,
                title: `Missing Bot Permissions`,
                description: `Command Name: **${command.name
                  }**\nRequired Permission: **${missingPermissions
                    .map((p) => `${p}`)
                    .join(" - ")}**`,
              })
              .catch(() => { });
          }
        }

        if (
          !message.channel
            .permissionsFor(message.guild.me)
            ?.has(Discord.Permissions.FLAGS.EMBED_LINKS) &&
          client.user.id !== userId
        ) {
          return channel.sendError({
            content: `Error: I need \`EMBED_LINKS\` permission to work.`,
          });
        }

        if (cmd.inVoiceChannel && !message.member.voice.channelId) {
          return message.channel.sendError({
            description: ` You must be in a voice channel.`,
          });
        }

        if (cmd.sameVoiceChannel) {
          if (message.guild.me.voice.channel) {
            if (
              message.guild.me.voice.channelId !==
              message.member.voice.channelId
            ) {
              return message.channel.sendError({
                description: ` You must be in the same channel as ${message.client.user}.`,
              });
            }
          }
        }
        client.statcord.postCommand(command, message.author.id);
        await cmd.execute(message, args, message.client, prefix);
        console.log(
          `${message.author.tag} ran command ${cmd.name} in ${message.guild.name
          } (${message.guild.id}) in channel ${message.channel.name} (${message.channel.id
          }) with args ${args.join(" ")} userId: ${message.author.id}`
        );
      } catch (e) {
        console.error(e);
        message.replyError({
          title: "Error",
          description: `Hey, ${message.author}! Something went wrong! \n \`\`\`js ${e} \`\`\``,
        });
      }
    } else {
      if (settings.chatbot.disabledChannels.includes(message.channel.id))
        return;
      client.statcord.postCommand("chatbot", message.author.id, message.client);
      executeChatBot(message, prefix, 0, settings.chatbot.chatbot);
    }
  },
};

async function inviteFilter(settings, message, client) {
  if (settings.antiLinks || !settings.antiInvites) return;
  let permissions = message.guild.permissionsFor(message.member);
  if (permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES)) return;

  const inviteLink = new RegExp(
    /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/g
  );
  if (inviteLink.test(message.content)) {
    const msgcontent = message.content;
    code = msgcontent.replace(
      /(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/?/g,
      ""
    );
    fetch(`https://discordapp.com/api/invite/${code}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.message !== "Unknown Invite") {
          message.delete().catch(() => { });
          message.channel.send({
            embeds: [
              {
                color: "RED",
                author: {
                  name: `${message.member.user.tag}`,
                  icon_url: message.member.user.displayAvatarURL({
                    format: "png",
                    dynamic: true,
                    size: 1024,
                  }),
                },
                footer: {
                  text: message.deletable
                    ? ""
                    : "Couldn't delete the message due to missing permissions.",
                },
                description: "No invite links here",
              },
            ],
          });
        }
      });
  } else {
    let links = message.content.match(
      /(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i
    );
    if (links) {
      message.delete().catch(() => { });
      message.channel.send({
        embeds: [
          {
            color: "RED",
            author: {
              name: `${message.member.user.tag}`,
              icon_url: message.member.user.displayAvatarURL({
                format: "png",
                dynamic: true,
                size: 1024,
              }),
            },
            footer: {
              text: message.deletable
                ? ""
                : "Couldn't delete the message due to missing permissions.",
            },
            description: "No invite links here",
          },
        ],
      });
    }
  }
}

async function linkFilter(settings, message, client) {
  if (!settings.antiLinks) return;
  let permissions = message.guild.permissionsFor(message.member);
  if (permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES)) return;
  if (hasLink(message.content)) {
    return deleteLink(message);
  }
}

function hasLink(string) {
  let link =
    /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;

  if (link.test(string)) return true;
  return false;
}

function deleteLink(message) {
  if (message.deletable) {
    message.delete().catch(() => { });
  }

  message.channel.send({
    embed: {
      color: "RED",
      author: {
        name: `${message.member.user.tag}`,
        icon_url: message.member.user.displayAvatarURL({
          format: "png",
          dynamic: true,
          size: 1024,
        }),
      },
      footer: {
        text: message.deletable
          ? ""
          : "Couldn't delete the message due to missing permissions.",
      },
      description: "No Links allowed here",
    },
  });
  return true;
}

function ratelimit(message, command) {
  try {
    if (message.author.permLevel > 4) return false;
    if (!command.cooldown) command.cooldown = 1;
    const cooldown = command.cooldown * 1000;
    const ratelimit = ratelimits.get(message.author.id) || {}; // get the ENMAP first.
    if (!ratelimit[command.name])
      ratelimit[command.name] = Date.now() - cooldown; // see if the command has been run before if not, add the ratelimit
    const difference = Date.now() - ratelimit[command.name]; // easier to see the difference
    if (difference < cooldown) {
      // check the if the duration the command was run, is more than the cooldown
      return moment
        .duration(cooldown - difference)
        .format("D [days], H [hours], m [minutes], s [seconds]", 1); // returns a string to send to a channel
    } else {
      ratelimit[command.name] = Date.now(); // set the key to now, to mark the start of the cooldown
      ratelimits.set(message.author.id, ratelimit); // set it
      return true;
    }
  } catch (e) {
    console.error(e);
  }
}
