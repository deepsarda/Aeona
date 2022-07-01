const Discord = require("discord.js");
let ratelimits = new Discord.Collection();
const afk = require("../../database/schemas/afk");
const Guild = require("../../database/schemas/Guild");
const User = require("../../database/schemas/User");
const Moderation = require("../../database/schemas/logging");
const Blacklist = require("../../database/schemas/blacklist");
const customCommand = require("../../database/schemas/customCommand");
const autoResponse = require("../../database/schemas/autoResponse");
const { description } = require("../../utils/config");
const autoResponseCooldown = new Set();
module.exports = {
  name: "messageCreate",
  async execute(client, message) {
    // Searching for a command

    if (!message.guild) {
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

    globalchat(settings, message, client);
    afkCheck(settings, message, client);

    const autoResponseSettings = await autoResponse.find({
      guildId: message.guild.id,
    });

    if (autoResponseSettings.length > 0) {
      for (let i = 0; i < autoResponseSettings.length; i++) {
        if (
          message.content
            .toLowerCase()
            .includes(autoResponseSettings[i].name.toLowerCase())
        ) {
          if (autoResponseCooldown.has(message.author.id)) {
            return message.channel.send(
              `${message.client.emoji.fail} Slow Down - ${message.author}`
            );
          } else {
            message.channel.send(
              autoResponseSettings[i].content
                .replace(/{user}/g, `${message.author}`)

                .replace(/{user_tag}/g, `${message.author.tag}`)
                .replace(/{user_name}/g, `${message.author.username}`)
                .replace(/{user_ID}/g, `${message.author.id}`)
                .replace(/{guild_name}/g, `${message.guild.name}`)
                .replace(/{guild_ID}/g, `${message.guild.id}`)
                .replace(/{memberCount}/g, `${message.guild.memberCount}`)
                .replace(/{size}/g, `${message.guild.memberCount}`)
                .replace(/{guild}/g, `${message.guild.name}`)
                .replace(
                  /{member_createdAtAgo}/g,
                  `${moment(message.author.createdTimestamp).fromNow()}`
                )
                .replace(
                  /{member_createdAt}/g,
                  `${moment(message.author.createdAt).format(
                    "MMMM Do YYYY, h:mm:ss a"
                  )}`
                )
            );
            autoResponseCooldown.add(message.author.id);
            setTimeout(() => {
              autoResponseCooldown.delete(message.author.id);
            }, 2000);
            break;
          }
        }
      }
    }

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
              s.delete().catch(() => {});
            }, 5000);
          })
          .catch(() => {});
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

    for (let p of prefixes) {
      if (message.content.toLowerCase().startsWith(p)) {
        prefix = p;
        break;
      }
    }

    if (!prefix) return;

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

    if (!command || command == "") {
      message.channel.send({
        title: "Hello, I am Aeona",
        description:
          "I am an Intellegent Multipurpose AI Chatbot, I am here to help you with your server.\n\nTo get started, type `+help` ",
        imageURL:
          "https://cdn.discordapp.com/attachments/982536937996959784/982560515052175370/chatbot.gif?size=4096",
      });
    }
    let cmd;
    if (await customCommands(message, command)) return;

    const disabledCommands = settings.disabledCommands;
    if (typeof disabledCommands === "string")
      disabledCommands = disabledCommands.split(" ");

    if (message.author.bot) return;
    if (message.client.commands.has(command.trim().toLowerCase())) {
      cmd = message.client.commands.get(command);

      const rateLimit = ratelimit(message, cmd);

      if (typeof rateLimit === "string")
        return message.channel
          .send(
            `Please wait **${rateLimit}** before running the **${cmd}** command again - ${
              message.author
            }\n\n${
              number === 1
                ? "*Did You know that Aeona has its own dashboard? `https://Aeona.xyz/dashboard`*"
                : ""
            }${
              number === 2
                ? "*You can check our top.gg page at `https://Aeona.xyz`*"
                : ""
            }`
          )
          .then((s) => {
            message.delete().catch(() => {});

            setTimeout(() => {
              s.delete().catch(() => {});
            }, 10000);
          })
          .catch(() => {});

      try {
        if (args.length < cmd.requiredArgs)
          return await message.channel.sendError({
            title: "Invalid Usage!",
            description: `Correct Usage: \`${cmd.usage}\`\nPlease retry this command.`,
          });
        const player = message.client.manager.get(message.guild.id);

        if (cmd.player && !player) {
          return message.channel.sendError({
            description: `There is no player for this guild.`,
          });
        }
        if (
          cmd.permission &&
          !message.member.permissions.has(command.permission)
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
                description: `Command Name: **${
                  command.name
                }**\nRequired Permission: **${missingPermissions
                  .map((p) => `${p}`)
                  .join(" - ")}**`,
              })
              .catch(() => {});
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
          embed.setDescription("You must be in a voice channel!");
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
          `${message.author.tag} ran command ${cmd.name} in ${
            message.guild.name
          } (${message.guild.id}) in channel ${message.channel.name} (${
            message.channel.id
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
const fetch = require("node-fetch");
async function globalchat(settings, message, client) {
  if (
    settings.globalChatChannel &&
    message.channel.id == settings.globalChatChannel
  ) {
    const userBlacklistSettings = await Blacklist.findOne({
      discordId: message.author.id,
    });
    if (userBlacklistSettings && userBlacklistSettings.isBlacklisted) return;

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
            s.delete().catch(() => {});
          }, 5000);
        })
        .catch(() => {});
    } else {
      async function globalChat() {
        let guilds = await Guild.find({ globalChatChannel: { $ne: null } });
        client.statcord.postCommand(
          "globalChat",
          message.author.id,
          message.client
        );
        console.log(
          `${message.member.displayName} sent ${message.content} in ${message.guild.name} ${message.author.id}`
        );

        function linkify(text) {
          var urlRegex =
            /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
          return text.replace(urlRegex, function (url) {
            return url.includes("tenor") ? url : "`Link was filtered`";
          });
        }

        message.content = linkify(message.content);
        for (let i = 0; i < guilds.length; i++) {
          let guild = guilds[i];
          if (guild.guildId != message.guild.id) {
            let channel = null;
            try {
              channel = await client.channels.fetch(guild.globalChatChannel);
            } catch (e) {}
            if (channel) {
              async function send() {
                try {
                  //Create a webhook for the channel if it doesn't exist

                  let webhooks = await channel.fetchWebhooks();
                  let webhook = webhooks.find((webhook) => webhook.token);

                  if (!webhook) {
                    webhook = await channel.createWebhook(
                      `${client.user.username} Global Chat`,
                      {
                        avatar: client.user.displayAvatarURL(),
                      }
                    );
                  }

                  webhook.send({
                    username: message.member.displayName,
                    avatarURL: message.member.displayAvatarURL(),
                    content: message.content,
                    embeds: message.embeds,

                    allowedMentions: { parse: [] },
                  });

                  if (message.attachments.size > 0) {
                    for (const [key, value] of message.attachments) {
                      webhook.send({
                        username: message.member.displayName,
                        avatarURL: message.member.displayAvatarURL(),
                        files: [value.url],
                      });
                    }
                  }
                } catch (e) {
                  channel
                    .send(
                      `Please give me MANAGE_WEBHOOKS permission to recieve global chat messages.`
                    )
                    .catch(() => {});
                }
              }
              send();
            }
          }
        }
      }
      globalChat();
    }
  }
}

async function inviteFilter(settings, message, client) {
  if (settings.antiLinks || !settings.antiInvites) return;
  if (
    !message.member.hasPermission(
      "ADMINISTRATOR" ||
        "MANAGE_GUILD" ||
        "BAN_MEMBERS" ||
        "KICK_MEMBERS" ||
        "MANAGE_MESSAGES"
    )
  ) {
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
            message.delete().catch(() => {});
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
                description: "No invite links here",
              },
            });
          }
        });
    } else {
      let links = message.content.match(
        /(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i
      );
      if (links) {
        message.delete().catch(() => {});
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
            description: "No invite links here",
          },
        });
      }
    }
  }
}

async function linkFilter(settings, message, client) {
  if (!settings.antiLinks) return;
  if (
    !message.member.hasPermission(
      "ADMINISTRATOR" ||
        "MANAGE_GUILD" ||
        "BAN_MEMBERS" ||
        "KICK_MEMBERS" ||
        "MANAGE_MESSAGES"
    )
  ) {
    if (hasLink(message.content)) {
      return deleteLink(message);
    }
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
    message.delete().catch(() => {});
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

async function afkCheck(settings, message, client) {
  if (message.mentions.members.first()) {
    const afklist = await afk.findOne({
      userID: message.mentions.members.first().id,
      serverID: message.guild.id,
    });
    if (afklist) {
      await message.guild.members.fetch(afklist.userID).then((member) => {
        let user_tag = member.user.tag;
        return message.channel
          .send(
            `**${afklist.oldNickname || user_tag || member.user.username}** ${
              language.afk6
            } ${afklist.reason} **- ${moment(afklist.time).fromNow()}**`
          )
          .catch(() => {});
      });
    }
  }

  const afklis = await afk.findOne({
    userID: message.author.id,
    serverID: message.guild.id,
  });

  if (afklis) {
    let nickname = `${afklis.oldNickname}`;
    message.member.setNickname(nickname).catch(() => {});
    await afk.deleteOne({ userID: message.author.id });
    return message.channel
      .send({
        description: `${language.afk7} ${afklis.reason}`,
      })
      .then((m) => {
        setTimeout(() => {
          m.delete().catch(() => {});
        }, 10000);
      });
  }
}

async function customCommands(message, command) {
  const customCommandSettings = await customCommand.findOne({
    guildId: message.guild.id,
    name: command.toLowerCase(),
  });

  const customCommandEmbed = await customCommand.findOne({
    guildId: message.guild.id,
    name: command.toLowerCase(),
  });

  if (
    customCommandSettings &&
    customCommandSettings.name &&
    customCommandSettings.description
  ) {
    if (userBlacklistSettings && userBlacklistSettings.isBlacklisted) return;

    let embed = new MessageEmbed()
      .setTitle(customCommandEmbed.title)
      .setDescription(customCommandEmbed.description)
      .setFooter(``);

    if (customCommandEmbed.image !== "none")
      embed.setImage(customCommandEmbed.image);
    if (customCommandEmbed.thumbnail !== "none")
      embed.setThumbnail(customCommandEmbed.thumbnail);

    if (customCommandEmbed.footer !== "none")
      embed.setFooter(customCommandEmbed.footer);
    if (customCommandEmbed.timestamp !== "no") embed.setTimestamp();
    if (customCommandEmbed.color == "default") {
      embed.setColor(message.guild.me.displayHexColor);
    } else embed.setColor(`${customCommandEmbed.color}`);

    return message.channel.send({ embeds: [embed] });
  }

  if (
    customCommandSettings &&
    customCommandSettings.name &&
    !customCommandSettings.description &&
    customCommandSettings.json == "false"
  ) {
    return message.channel.send(
      customCommandSettings.content

        .replace(/{user}/g, `${message.author}`)

        .replace(/{user_tag}/g, `${message.author.tag}`)
        .replace(/{user_name}/g, `${message.author.username}`)
        .replace(/{user_ID}/g, `${message.author.id}`)
        .replace(/{guild_name}/g, `${message.guild.name}`)
        .replace(/{guild_ID}/g, `${message.guild.id}`)
        .replace(/{memberCount}/g, `${message.guild.memberCount}`)
        .replace(/{size}/g, `${message.guild.memberCount}`)
        .replace(/{guild}/g, `${message.guild.name}`)
        .replace(
          /{member_createdAtAgo}/g,
          `${moment(message.author.createdTimestamp).fromNow()}`
        )
        .replace(
          /{member_createdAt}/g,
          `${moment(message.author.createdAt).format(
            "MMMM Do YYYY, h:mm:ss a"
          )}`
        )
    );
  }

  if (
    customCommandSettings &&
    customCommandSettings.name &&
    !customCommandSettings.description &&
    customCommandSettings.json == "true"
  ) {
    const command = JSON.parse(customCommandSettings.content);
    message.channel.send(command).catch((e) => {
      message.channel.send(
        `There was a problem sending your embed, which is probably a JSON error.\nRead more here --> https://Aeona.xyz/embeds\n\n__Error:__\n\`${e}\``
      );
    });

    return true;
  }
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

const http = require("https");
async function executeChatBot(message, prefix, i, chatbot) {
  if (i == 5) {
    return;
  }

  i++;
  try {
    let bot = message.client;
    message.channel.sendTyping();

    let context = undefined;
    let context1 = undefined;
    let context2 = undefined;
    let context3 = undefined;
    let context4 = undefined;
    let context5 = undefined;

    if (message.reference) {
      let message2 = await message.fetchReference();
      if (!message2) {
        return;
      }
      context = message2.content;
      if (message2.reference) {
        let message3 = await message2.fetchReference();
        context1 = message3.content;
        if (message3.reference) {
          let message4 = await message3.fetchReference();
          context2 = message4.content;
          if (message4.reference) {
            let message5 = await message4.fetchReference();
            context3 = message5.content;
            if (message5.reference) {
              let message6 = await message5.fetchReference();
              context4 = message6.content;
              if (message6.reference) {
                let message7 = await message6.fetchReference();
                context5 = message7.content;
              }
            }
          }
        }
      }
    }
    message.content = message.content.slice(prefix.length).trim();
    if (message.content.trim() == "") {
      message.content = "UDC";
    }
    const options = {
      method: "GET",
      hostname: "aeona3.p.rapidapi.com",
      port: null,
      path: encodeURI(
        "/?" +
          `text=${message.content}&userId=${message.author.id}${
            context ? `&context=${context}` : ""
          }${context1 ? `&context1=${context1}` : ""} ${
            context2 ? `&context2=${context2}` : ""
          } ${context3 ? `&context3=${context3}` : ""} ${
            context4 ? `&context4=${context4}` : ""
          } ${context5 ? `&context5=${context5}` : ""} ${
            chatbot ? `&chatbot=${chatbot}` : ""
          }`
      ),
      headers: {
        "X-RapidAPI-Host": "aeona3.p.rapidapi.com",
        "X-RapidAPI-Key": process.env.apiKey,
        useQueryString: true,
      },
    };
    const req = http.request(options, function (res) {
      const chunks = [];
      req.on("error", function (e) {
        console.log(e);
        executeChatBot(message, "", i, chatbot);
      });

      req.on("timeout", function () {
        console.log("timeout");
        req.abort();
        executeChatBot(message, "", i, chatbot);
      });
      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", async function () {
        const body = Buffer.concat(chunks);
        let reply = body.toString();

        //If reply is not a json
        if (
          reply.toLowerCase().includes("<html>") ||
          reply.toLowerCase().includes("<body>") ||
          reply.toLowerCase().includes("error")
        ) {
          executeChatBot(message, "", i, chatbot);
          return;
        }
        if (reply != "" && !reply.includes("!!!!")) {
          const command = message.client.commands.get(reply.toLowerCase());
          let comp = [];
          if (Math.random() * 100 < 15) {
            comp = [
              new Discord.MessageActionRow().addComponents(
                new Discord.MessageButton()
                  .setLabel("Invite")
                  .setURL(
                    "https://discord.com/api/oauth2/authorize?client_id=931226824753700934&permissions=8&scope=applications.commands%20bot"
                  )
                  .setStyle("LINK"),
                new Discord.MessageButton()
                  .setLabel("Support Server")
                  .setURL("https://aeona.xyz/invite")
                  .setStyle("LINK"),
                new Discord.MessageButton()
                  .setLabel("Website/Dashboard")
                  .setURL("https://aeona.xyz")
                  .setStyle("LINK"),
                new Discord.MessageButton()
                  .setLabel("Vote")
                  .setURL("https://top.gg/bot/931226824753700934/vote")
                  .setStyle("LINK")
              ),
            ];
          }
          try {
            let p = await message
              .reply({
                content: reply,
                components: comp,
                embeds: [],
              })
              .catch((e) => {
                return;
              });

            if (command) {
              console.log(command);
              command.run(p, [], message.client);
            }

            return;
          } catch (e) {
            console.log(e);
            executeChatBot(message, "", i, chatbot);
            return;
          }
        }
        message.content = "UDC";
        executeChatBot(message, "", i, chatbot);
        return;
      });
    });
    req.end();
  } catch (e) {
    console.log(e);
    executeChatBot(message, "", i, chatbot);
  }
}
