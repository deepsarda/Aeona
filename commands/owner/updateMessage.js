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
          title: "v6.0.0 is out!",
          description:
            " This is the largest update in the history of Aeona\n\n\n\n **[Please upvote us!](https://top.gg/bot/931226824753700934/vote)** \n\n\n\n > Changelog:\n\n\n",
          fields: [
            {
              name: "Aeona now has over 180 commands!",
              value:
                "\nWhen we last counted we had around 100 commands!\n We now have feature equal if not more to bots like mee6 and carl bot!  \n\n\n\n\n",
              inline: false,
            },
            {
              name: "Website!",
              value:
                "The website has been redesigned while keeping the same core values as before!  The dashboard is way way more powerful! \n\n\nThis allows you to use the new features with a greater ease than before!\n\n\n\n\n",
              inline: false,
            },
            {
              name: "v6.1.0",
              value:
                "This update will come in next few days! It will be mainly a bug fixes and a brand new game if it is finished in time!\n\nor it will come with the full economy system when v6.2.0 releases!",
              inline: false,
            },
          ],
          image: {
            url: "https://cdn.discordapp.com/attachments/970641138912489492/971461570083299398/unknown.png",
          },
          footer: {
            text: "The current look of dashboard",
          },
          color: 9115903,
        },
      ],
      content:
        "https://aeona.xyz/  || https://cdn.discordapp.com/attachments/942118536166383717/971460584593850468/unknown.png ||",
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
