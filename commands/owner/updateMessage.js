const Command = require("../../structures/Command");
const Discord = require("discord.js");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "updatemessage",
      description: "Send a update message to all servers!",
      category: "Owner",
      ownerOnly: true,
    });
  }

  async run(message) {
    let updateMessage = {
      embeds: [
        {
          "title": "v6.1.0 is out!",
          "description": "** This is a massive AI update!**\n\n\n\n> Changelog:\n\n\n",
          "fields": [
              {
                  "name": "Added `+chatbot` command",
                  "value": "This allows you to change the chatbot. **Premium only feature**. \n\n\n\n\n",
                  "inline": false
              },
              {
                  "name": "Get Aeona Premium For Free!",
                  "value": "**[Upvote us and leave a review!](https://top.gg/bot/931226824753700934)** Then dm `LoneWolf#0022` to get it for free!\n\n\n\n\n",
                  "inline": false
              },
              {
                  "name": "v6.2.0",
                  "value": "This update will come in next few days! It will be mainly a bug fixes and a brand new game if it is finished in time!\n\nor it will come with the full economy system when v6.3.0 releases!",
                  "inline": false
              }
          ],
          "image": {
              "url": "https://cdn.discordapp.com/attachments/942118536166383717/973915337588363284/unknown.png?size=4096"
          },
          "footer": {
              "text": "The current options for Chatbot!"
          },
          "color": 9115903
        },
      ],
      content:
        "https://discord.gg/SPcmvDMRrP",
      components: [
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
            .setURL("https://aeona.xyz")
            .setStyle("LINK"),
          new Discord.MessageButton()
            .setLabel("Vote")
            .setURL("https://top.gg/bot/931226824753700934/vote")
            .setStyle("LINK")
        ),
      ],
    };
    let bot=message.client;
    for (var i = 0; i < bot.guilds.cache.size; i++) {
      var guild = bot.guilds.cache.at(i);
      await guild.channels.fetch();
      var everyone = guild.roles.everyone;
      //filter the guild channels based on the bot's permissions , channel is not private and if the channel is a text channel
      var channels = guild.channels.cache.filter(function (channel) {
        return (
          channel.isText() &&
          channel.permissionsFor(guild.me).has("SEND_MESSAGES") &&
          channel.permissionsFor(everyone).has("SEND_MESSAGES")
        );
      });

      var systemChannelIsGood = false;
      var systemChannel = guild.systemChannel;
      if (systemChannel) {
        if (
          systemChannel.permissionsFor(guild.me).has("SEND_MESSAGES") &&
          systemChannel.permissionsFor(everyone).has("SEND_MESSAGES")
        ) {
          systemChannel.send(updateMessage);
          systemChannelIsGood = true;
        }
      }
      //Look for a channel named "chat" or "general"
      if (!systemChannelIsGood) {
        var channel = channels.find(
          (channel) =>
            channel.name.toLowerCase().includes("chat") ||
            channel.name.toLowerCase().includes("general")
        );

        if (channel) {
          channel.send(updateMessage);
          console.log(
            "Sending update message to " + channel.name + " in " + guild.name
          );
        } else {
          //Get the system channel
          channel = guild.systemChannel;
          if (!channel) {
            //If there is no system channel, get the first channel
            channels = guild.channels.cache.filter(function (channel) {
              return (
                channel.isText() &&
                channel.permissionsFor(guild.me).has("SEND_MESSAGES")
              );
            });
            channel = channels.at(0);

            if (!channel) {
              util.error({
                msg: message,
                title: "No channel found",
                description:
                  "I could not find a channel to send the message to for guild: " +
                  guild.name,
              });
            } else {
              channel.send(updateMessage);
              console.log(
                "Sending update message to " +
                  channel.name +
                  " in " +
                  guild.name
              );
            }
          } else {
            var e = embed;
            e.channel = channel;
            util.success(e);
            console.log(
              "Sending update message to " + channel.name + " in " + guild.name
            );
          }
        }
      }
    }
  }
};
