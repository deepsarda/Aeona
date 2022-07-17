const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js");
const { cleanNull } = require("./cleanNull.js");
const data = require("../data.js");

class Resource {
  constructor(options) {
    if ("color" in options) this.color = options.color;
    this.emote = options.emote;
  }

  get color() {
    const colors = data.colors;

    return colors[Math.floor(Math.random() * colors.length)];
  }

  set color(color) {
    return color;
  }

  embed = (options) => {
    //If options is a string, it's the content
    if (typeof options === "string" || options instanceof String) {
      return options;
    }
    if (options.embeds) return options;
    const msg = options.msg;
    let title = "";

    if(!options.description) return options;
    if ("emote" in options) title = `${options.emote}`;
    else if (this.emote !== undefined) title = `${this.emote}`;
    title += `  ⌑ ⌈ ${cleanNull(options.title).toUpperCase()} ⌋ ⌑`;
    

    if (options.title === undefined) title = "";
    const embed = new MessageEmbed()
      .setTitle(title)
      .setURL(cleanNull(options.url))
      .setDescription(cleanNull(options.description))
      .setColor(options.color ?? this.color)
      .setImage(options.imageURL)
      .setThumbnail(options.thumbnailURL)
      .setTimestamp();

    if (options.author === "author") {
      embed.setAuthor({
        name: options.authorName ?? msg.author.tag,
        iconURL:
          options.authorIconURL ??
          msg.member.displayAvatarURL({
            dynamic: true,
          })
            ? msg.member.displayAvatarURL({
                dynamic: true,
              })
            : null,
        url: cleanNull(options.authorURL),
      });
    } else if (options.author === "footer") {
      embed.setFooter({
        text: options.footerText ?? msg.author.tag,
        iconURL:
          options.footerIconURL ??
          msg.member.displayAvatarURL({
            dynamic: true,
          }),
      });
    } else {
      if (!options.footerText && msg) {
        embed.setFooter({
          text: `Requested by: ${msg.author.tag}`,
          iconURL: msg.member
            ? msg.member.displayAvatarURL({
                dynamic: true,
              })
            : msg.author.displayAvatarURL({
                dynamic: true,
              }),
        });
      } else {
        embed.setAuthor({
          name: cleanNull(options.authorName),
          iconURL: cleanNull(options.authorIconURL),
          url: cleanNull(options.authorURL),
        });

        embed.setFooter({
          text: cleanNull(options.footerText),
          iconURL: cleanNull(options.footerIconURL),
        });
      }
    }

    const fieldNames = cleanNull(options.fieldNames, "array");
    const fieldValues = cleanNull(options.fieldValues, "array");
    const inlines = cleanNull(options.inlines, "array");

    for (let i = 0; i < fieldNames.length; i++)
      embed.addField(fieldNames[i], fieldValues[i], inlines[i]);

    if (options.embed === true) return embed;

    if (!options.components && Math.floor(Math.random() * 100) < -1) {
      options.components = [
        new Discord.MessageActionRow().addComponents(
          new Discord.MessageButton()
            .setLabel("Invite")
            .setURL(
              "https://discord.com/api/oauth2/authorize?client_id=931226824753700934&permissions=8&scope=applications.commands%20bot"
            )
            .setStyle("LINK"),
          new Discord.MessageButton()
            .setLabel("Vote")
            .setURL("https://top.gg/bot/931226824753700934/vote")
            .setStyle("LINK"),
          new Discord.MessageButton()
            .setLabel("Premium")
            .setURL("https://aeona.xyz/premium")
            .setStyle("LINK")
        ),
      ];
    }

    const messageOptions = {
      content: options.content,
      embeds: [embed],
      reply: options.reply,
      tts: cleanNull(options.tts, "boolean"),
      files: cleanNull(options.files, "array"),
      components: options.components,
      resources: true,
      ephemeral: cleanNull(options.ephemeral, "boolean"),
    };

    return messageOptions;
  };
}

module.exports = {
  emotes: data,
  success: new Resource({
    emote: data.defaultE,
  }),
  error: new Resource({
    color: data.errorC,
    emote: data.errorE,
  }),
};
