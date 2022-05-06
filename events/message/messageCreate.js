const Event = require("../../structures/Event");
const { Permissions, Collection } = require("discord.js");
const afk = require("../../models/afk");
const Statcord = require("statcord.js");
const moment = require("moment");
const discord = require("discord.js");
const config = require("../../config.json.js");
const { MessageEmbed, WebhookClient } = require("discord.js");
const logger = require("../../utils/logger");
const mongoose = require("mongoose");
const Guild = require("../../database/schemas/Guild");
const User = require("../../database/schemas/User");
const Moderation = require("../../database/schemas/logging");
const Blacklist = require("../../database/schemas/blacklist");
const customCommand = require("../../database/schemas/customCommand");
const autoResponse = require("../../database/schemas/autoResponse");
const autoResponseCooldown = new Set();
const inviteFilter = require("../../filters/inviteFilter");
const linkFilter = require("../../filters/linkFilter");
const maintenanceCooldown = new Set();
const metrics = require("datadog-metrics");
const permissions = require("../../assets/json/permissions.json");
const Maintenance = require("../../database/schemas/maintenance");
const fetch = require("node-fetch");
require("moment-duration-format");

module.exports = class extends Event {
  constructor(...args) {
    super(...args);

    this.impliedPermissions = new Permissions([
      "VIEW_CHANNEL",
      "SEND_MESSAGES",
      "SEND_TTS_MESSAGES",
      "EMBED_LINKS",
      "ATTACH_FILES",
      "READ_MESSAGE_HISTORY",
      "MENTION_EVERYONE",
      "USE_EXTERNAL_EMOJIS",
      "ADD_REACTIONS",
    ]);

    this.ratelimits = new Collection();
  }

  async run(message) {
    let client = message.client;
    try {
      if (!message.guild) return;

      if (config.datadogApiKey) {
        metrics.init({
          apiKey: this.client.config.datadogApiKey,
          host: "Aeona",
          prefix: "Aeona.",
        });
      }

      const mentionRegex = RegExp(`^<@!?${this.client.user.id}>$`);
      const mentionRegexPrefix = RegExp(`^<@!?${this.client.user.id}>`);

      if (!message.guild || message.author.bot) return;

      let settings = await Guild.findOne({
        guildId: message.guild.id,
      });

      if (!settings) {
        settings = new Guild({
          guildId: message.guild.id,
          prefix:"+",
        });
        await settings.save();
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

      if (message.content.match(mentionRegex)) {
        const proofita = `\`\`\`css\n[     Prefix: ${
          settings.prefix || "!"
        }     ]\`\`\``;
        const proofitaa = `\`\`\`css\n[      Help: ${
          settings.prefix || "!"
        }help    ]\`\`\``;
        const embed = new MessageEmbed()
          .setTitle("Hello, I'm Aeona. What's Up?")
          .addField(`Prefix`, proofita, true)
          .addField(`Usage`, proofitaa, true)
          .setDescription(
            `\nIf you like Aeona, Consider [voting](https://top.gg/bot/931226824753700934), or [inviting](https://discord.com/oauth2/authorize?client_id=931226824753700934&scope=bot&permissions=470150262) it to your server! Thank you for using Aeona, we hope you enjoy it, as we always look forward to improve the bot`
          )
          .setFooter({ text: "Thank you for using Aeona!!" })
          .setColor("#FF2C98");
        message.channel.send({ embeds: [embed] });
      }

      if (config.datadogApiKey) {
        metrics.increment("messages_seen");
      }

      // Filters
      if (settings && (await inviteFilter(message))) return;
      if (settings && (await linkFilter(message))) return;

      let mainPrefix = settings ? settings.prefix : "+";

      let prefix;
      let prefixes = [
        mainPrefix,
        mainPrefix == "+" ? ">" : null,
        "aeona",
        `<@${client.user.id}>`,
        `<@!${client.user.id}>`,
      ];
      for (let i = 0; i < prefixes.length; i++) {
        if (message.content.toLowerCase().startsWith(prefixes[i]))
          prefix = prefixes[i];
      }
      if (message.mentions.repliedUser) {
        if (message.mentions.repliedUser.id == message.client.user.id) {
          prefix = "";
        }
      }

      if (settings.chatbot.alwaysOnChannel) prefix = "";

      const moderation = await Moderation.findOne({
        guildId: message.guild.id,
      });

      if (!moderation) {
        Moderation.create({
          guildId: message.guild.id,
        });
      }
      // maintenance mode

      const maintenance = await Maintenance.findOne({
        maintenance: "maintenance",
      });

      const userBlacklistSettings = await Blacklist.findOne({
        discordId: message.author.id,
      });
      const guildBlacklistSettings = await Blacklist.findOne({
        guildId: message.guild.id,
      });
      //autoResponse

      const autoResponseSettings = await autoResponse.findOne({
        guildId: message.guild.id,
        name: message.content.toLowerCase(),
      });

      if (autoResponseSettings && autoResponseSettings.name) {
        if (userBlacklistSettings && userBlacklistSettings.isBlacklisted)
          return;
        if (maintenance && maintenance.toggle == "true") return;
        if (autoResponseCooldown.has(message.author.id))
          return message.channel.send(
            `${message.client.emoji.fail} Slow Down - ${message.author}`
          );

        message.channel.send(
          autoResponseSettings.content

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

        return;
      }

      //afk
      let language = require(`../../data/language/english.json`);
      if (settings)
        language = require(`../../data/language/${settings.language}.json`);

      moment.suppressDeprecationWarnings = true;

      if (message.mentions.members.first()) {
        if (maintenance && maintenance.toggle == "true") return;
        const afklist = await afk.findOne({
          userID: message.mentions.members.first().id,
          serverID: message.guild.id,
        });
        if (afklist) {
          await message.guild.members.fetch(afklist.userID).then((member) => {
            let user_tag = member.user.tag;
            return message.channel
              .send(
                `**${
                  afklist.oldNickname || user_tag || member.user.username
                }** ${language.afk6} ${afklist.reason} **- ${moment(
                  afklist.time
                ).fromNow()}**`
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
        if (maintenance && maintenance.toggle == "true") return;
        let nickname = `${afklis.oldNickname}`;
        message.member.setNickname(nickname).catch(() => {});
        await afk.deleteOne({ userID: message.author.id });
        return message.channel
          .send({
            embeds: [
              new discord.MessageEmbed()
                .setColor("GREEN")
                .setDescription(`${language.afk7} ${afklis.reason}`),
            ],
          })
          .then((m) => {
            setTimeout(() => {
              m.delete().catch(() => {});
            }, 10000);
          });
      }

      if (!message.content.startsWith(prefix)) return;

      // eslint-disable-next-line no-unused-vars
      const [cmd, ...args] = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/g);
      const command =
        this.client.commands.get(cmd.toLowerCase()) ||
        this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));

      // maintenance mode

      if (!this.client.config.developers.includes(message.author.id)) {
        if (maintenance && maintenance.toggle == "true") {
          if (maintenanceCooldown.has(message.author.id)) return;

          message.channel.send(
            `Aeona is currently undergoing maintenance which won't allow anyone to access Aeona's Commands. Feel free to try again later.`
          );

          maintenanceCooldown.add(message.author.id);
          setTimeout(() => {
            maintenanceCooldown.delete(message.author.id);
          }, 10000);

          return;
        }
      }

      // Custom Commands
      const customCommandSettings = await customCommand.findOne({
        guildId: message.guild.id,
        name: cmd.toLowerCase(),
      });

      const customCommandEmbed = await customCommand.findOne({
        guildId: message.guild.id,
        name: cmd.toLowerCase(),
      });

      if (
        customCommandSettings &&
        customCommandSettings.name &&
        customCommandSettings.description
      ) {
        if (userBlacklistSettings && userBlacklistSettings.isBlacklisted)
          return;

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
        if (userBlacklistSettings && userBlacklistSettings.isBlacklisted)
          return;
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
        if (userBlacklistSettings && userBlacklistSettings.isBlacklisted)
          return;
        const command = JSON.parse(customCommandSettings.content);
        return message.channel.send(command).catch((e) => {
          message.channel.send(
            `There was a problem sending your embed, which is probably a JSON error.\nRead more here --> https://Aeona.xyz/embeds\n\n__Error:__\n\`${e}\``
          );
        });
      }

      if (command) {
        await User.findOne(
          {
            discordId: message.author.id,
          },
          (err, user) => {
            if (err) console.log(err);

            if (!user) {
              const newUser = new User({
                discordId: message.author.id,
              });

              newUser.save();
            }
          }
        );

        const disabledCommands = settings.disabledCommands;
        if (typeof disabledCommands === "string")
          disabledCommands = disabledCommands.split(" ");

        const rateLimit = this.ratelimit(message, cmd);

        if (
          !message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")
        )
          return;

        // Check if user is Blacklisted
        if (userBlacklistSettings && userBlacklistSettings.isBlacklisted) {
          logger.warn(
            `${message.author.tag} tried to use "${cmd}" command but the user is blacklisted`,
            { label: "Commands" }
          );
          return message.channel.send(
            `${message.client.emoji.fail} You are blacklisted from the bot :(`
          );
        }

        // Check if server is Blacklisted
        if (guildBlacklistSettings && guildBlacklistSettings.isBlacklisted) {
          logger.warn(
            `${message.author.tag} tried to use "${cmd}" command but the guild is blacklisted`,
            { label: "Commands" }
          );
          return message.channel.send(
            `${message.client.emoji.fail} This guild is Blacklisted :(`
          );
        }

        let number = Math.floor(Math.random() * 10 + 1);
        if (typeof rateLimit === "string")
          return message.channel
            .send(
              ` ${
                message.client.emoji.fail
              } Please wait **${rateLimit}** before running the **${cmd}** command again - ${
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
              s.delete({ timeout: 4000 }).catch(() => {});
            })
            .catch(() => {});

        if (command.botPermission) {
          const missingPermissions = message.channel
            .permissionsFor(message.guild.me)
            .missing(command.botPermission)
            .map((p) => permissions[p]);

          if (missingPermissions.length !== 0) {
            const embed = new MessageEmbed()
              .setAuthor(
                `${this.client.user.tag}`,
                message.client.user.displayAvatarURL({ dynamic: true })
              )
              .setTitle(`:x: Missing Bot Permissions`)
              .setDescription(
                `Command Name: **${
                  command.name
                }**\nRequired Permission: **${missingPermissions
                  .map((p) => `${p}`)
                  .join(" - ")}**`
              )
              .setTimestamp()
              .setFooter("https://Aeona.xyz")
              .setColor(message.guild.me.displayHexColor);
            return message.channel.send({ embeds: [embed] }).catch(() => {});
          }
        }

        if (command.userPermission && !this.client.config.developers.includes(message.author.id)) {
          const missingPermissions = message.channel
            .permissionsFor(message.author)
            .missing(command.userPermission)
            .map((p) => permissions[p]);
          if (missingPermissions.length !== 0) {
            const embed = new MessageEmbed()
              .setAuthor(
                `${message.author.tag}`,
                message.author.displayAvatarURL({ dynamic: true })
              )
              .setTitle(`:x: Missing User Permissions`)
              .setDescription(
                `Command Name: **${
                  command.name
                }**\nRequired Permission: **${missingPermissions
                  .map((p) => `${p}`)
                  .join("\n")}**`
              )
              .setTimestamp()
              .setFooter("https://Aeona.xyz")
              .setColor(message.guild.me.displayHexColor);
            return message.channel.send({ embeds: [embed] }).catch(() => {});
          }
        }
        if (disabledCommands.includes(command.name || command)) return;

        if (command.ownerOnly) {
          if (!this.client.config.developers.includes(message.author.id))
            return;
        }

        if (config.datadogApiKey) {
          metrics.increment("commands_served");
          metrics.increment("command." + command.name);
        }

        if (command.disabled)
          return message.channel.send(
            `The owner has disabled the following command for now. Try again Later!\n\n`
          );

        await this.runCommand(message, cmd, args).catch((error) => {
          if (config.datadogApiKey) {
            metrics.increment("command_error");
          }

          return this.client.emit("commandError", error, message, cmd);
        });
      } else {
        if (config.datadogApiKey) {
          metrics.increment("commands_served");
          metrics.increment("command.chatbot");
        }
        execute(message, prefix, 0);
      }
    } catch (error) {
      if(settings.dis)
      if (config.datadogApiKey) {
        metrics.increment("command_error");
      }
      return this.client.emit("fatalError", error, message);
    }
  }

  async runCommand(message, cmd, args) {
    if (
      !message.channel.permissionsFor(message.guild.me) ||
      !message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")
    )
      return message.channel.send(
        `${message.client.emoji.fail} Missing bot Permissions - **Embeds Links**`
      );

    const command =
      this.client.commands.get(cmd.toLowerCase()) ||
      this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));
    logger.info(
      `"${message.content}" (${command.name}) ran by "${message.author.tag}" (${message.author.id}) on guild "${message.guild.name}" (${message.guild.id}) channel "#${message.channel.name}" (${message.channel.id})`,
      { label: "Command" }
    );

    await command.run(message, args);
  }

  ratelimit(message, cmd) {
    try {
      const command =
        this.client.commands.get(cmd.toLowerCase()) ||
        this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));
      if (message.author.permLevel > 4) return false;

      const cooldown = command.cooldown * 1000;
      const ratelimits = this.ratelimits.get(message.author.id) || {}; // get the ENMAP first.
      if (!ratelimits[command.name])
        ratelimits[command.name] = Date.now() - cooldown; // see if the command has been run before if not, add the ratelimit
      const difference = Date.now() - ratelimits[command.name]; // easier to see the difference
      if (difference < cooldown) {
        // check the if the duration the command was run, is more than the cooldown
        return moment
          .duration(cooldown - difference)
          .format("D [days], H [hours], m [minutes], s [seconds]", 1); // returns a string to send to a channel
      } else {
        ratelimits[command.name] = Date.now(); // set the key to now, to mark the start of the cooldown
        this.ratelimits.set(message.author.id, ratelimits); // set it
        return true;
      }
    } catch (e) {
      this.client.emit("fatalError", error, message);
    }
  }
};

const http = require("https");
async function execute(message, prefix, i) {
  if (i == 10) {
    return;
  }

  if (message.content == "") {
    message.content = "RANDOM";
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

    const options = {
      method: "GET",
      hostname: "dumbotapi.aeona.repl.co",
      port: null,
      path: encodeURI(
        "/?" +
          `text=${message.content.slice(prefix.length).trim()}&userId=${
            message.author.id
          }&key=${process.env.apiKey}${context ? `&context=${context}` : ""}${
            context1 ? `&context1=${context1}` : ""
          } ${context2 ? `&context2=${context2}` : ""} ${
            context3 ? `&context3=${context3}` : ""
          } ${context4 ? `&context4=${context4}` : ""} ${
            context5 ? `&context5=${context5}` : ""
          }`
      ),
    };
    const req = http.request(options, function (res) {
      const chunks = [];
      req.on("error", function (e) {
        console.log(e);
        execute(message, prefix, i);
      });

      req.on("timeout", function () {
        console.log("timeout");
        req.abort();
        execute(message, "", i);
      });
      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", async function () {
        const body = Buffer.concat(chunks);
        let reply = body.toString();

        //If reply is not a json
        if (reply.toLowerCase().includes("<html>")) {
          execute(message, "", i);
          return;
        }
        if (!reply.startsWith("{") && reply != "") {
          let comp = [];
          if (Math.random() * 100 < 5) {
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
                  .setURL("https://discord.gg/YKwf9B39fT")
                  .setStyle("LINK"),
                new Discord.MessageButton()
                  .setLabel("Website/Dashboard")
                  .setURL("https://aeona.repl.co")
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
              })
              .catch((e) => {
                return;
              });

            const webhook = new WebhookClient({
              url: "https://discord.com/api/webhooks/971702971412914226/G7p8jTOMtPvaW4u6KBpxn1YO2SsBQUBzShAaVDjGhOj2ebr2XAsL99Zj7PrjXlcdk-eN",
            });
            webhook.send(
              `\n\n **AI query** ${message.content} \n\n **User** ${message.member.displayName} \n\n **Guild** ${message.guild.name} \n\n **AI response** ${reply}`
            );

            return;
          } catch (e) {
            console.log(e);
            execute(message, "", i);
            return;
          }
        }
        message.content = "Random";
        execute(message, "", i);
        return;
      });
    });
    req.end();
  } catch (e) {
    console.log(e);
    execute(message, prefix, i);
  }
}
