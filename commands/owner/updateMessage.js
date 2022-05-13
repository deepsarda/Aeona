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
          title: "v6.1.1 is out!",
          description:
            "** This is a tweak to the chatbot command and bugfixes!** \n > Changelog:\n\n\n",
          fields: [
            {
              name: "Changed `+chatbot` command",
              value:
                "You can now use `+chatbot` without manage guild permission.",
              inline: false,
            },
            {
              name: "Aeona is giving away free premium!",
              value:
                "** To get it simply invite me to your server and on 24 hr from now your server will get free premium!**",
              inline: false,
            },
            {
              name: "Music bugfixes",
              value:
                "** Fixed a bug where the bot would not play music in voice channels.**",
              inline: false,
            },
            
            {
              name: "v6.2.0",
              value:
                "This update will come in next few days! It will be mainly a bug fixes and a brand new game if it is finished in time!\n\nor it will come with the full economy system when v6.3.0 releases!",
              inline: false,
            },
          ],
          image: {
            url: "https://cdn.discordapp.com/attachments/942118536166383717/973915337588363284/unknown.png?size=4096",
          },
          footer: {
            text: "The current options for Chatbot!",
          },
          color: 9115903,
        },
      ],
      content: "https://discord.gg/SPcmvDMRrP",
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
    let bot = message.client;
    for (var i = 0; i < bot.guilds.cache.size; i++) {
      var guild = bot.guilds.cache.at(i);
      await guild.channels.fetch();
      var everyone = guild.roles.everyone;
      //filter the guild channels based on the bot's permissions , channel is not private and if the channel is a text channel
      var channels = guild.channels.cache.filter(function (channel) {
        return (
          channel.isText() &&
          channel.permissionsFor(guild.me).has("SEND_MESSAGES") &&
          channel.permissionsFor(guild.me).has("EMBED_LINKS") &&
          channel.permissionsFor(everyone).has("SEND_MESSAGES")
        );
      });

      var systemChannelIsGood = false;
      var systemChannel = guild.systemChannel;
      if (systemChannel) {
        if (
          systemChannel.permissionsFor(guild.me).has("SEND_MESSAGES") &&
          systemChannel.permissionsFor(guild.me).has("EMBED_LINKS") &&
          systemChannel.permissionsFor(everyone).has("SEND_MESSAGES")
        ) {
          try {
            await systemChannel.send(updateMessage);
            systemChannelIsGood = true;
          } catch (e) {}
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
          try {
            await channel.send(updateMessage);
            console.log(
              "Sending update message to " + channel.name + " in " + guild.name
            );
          } catch (e) {}
        } else {
          //Get the system channel
          channel = guild.systemChannel;
          if (!channel) {
            //If there is no system channel, get the first channel
            channels = guild.channels.cache.filter(function (channel) {
              return (
                channel.isText() &&
                channel.permissionsFor(guild.me).has("SEND_MESSAGES") &&
                channel.permissionsFor(guild.me).has("EMBED_LINKS")
              );
            });
            channel = channels.at(0);

            if (!channel) {
            } else {
              try {
                await channel.send(updateMessage);
                console.log(
                  "Sending update message to " +
                    channel.name +
                    " in " +
                    guild.name
                );
              } catch (e) {}
            }
          } else {
            try {
              await channel.send(updateMessage);
              console.log(
                "Sending update message to " +
                  channel.name +
                  " in " +
                  guild.name
              );
            } catch (e) {}
          }
        }
      }
    }
  }
};
