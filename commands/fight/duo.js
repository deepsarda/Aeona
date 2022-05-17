const Discord = require("discord.js");
const Command = require("../../structures/Command");
const game = require("../../packages/fight");
let fight;

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "duo",
      aliases: ["fight"],
      usage: "",
      description: "Fight against someone else!",
      category: "fight",
      cooldown: 3,
    });
  }

  async run(message, args) {
    let client = message.client;
    if (!fight) fight = new game(client);

    let user2 = message.mentions.users.first()
      ? message.mentions.users.first()
      : message.guild.members.cache.get(args[0])
      ? message.guild.members.cache.get(args[0])
      : null;

    if (!user2)
      return message.channel.send(
        `<@${message.author.id}>, you need to specify a user!`
      );

    let m = await message.channel.send({
      content: `<@${message.author.id}>, <@${user2.id}> wants to fight! Do you accept? type -accept to accept or -decline to decline!`,
    });

    const filter = (me) => me.author.id === user2.id;

    m.channel
      .awaitMessages({ filter, max: 1, time: 1000 * 60 * 15, errors: ["time"] })
      .then(async (collected) => {
        if (collected.first().content.toLowerCase() === "-accept") {
          await fight.duo(message, user2);
        } else {
          message.channel.send(
            `<@${user2.id}> declined <@${message.author.id}>'s duel!`
          );
        }
      })
      .catch((err) => {
        message.channel.send(
          `<@${message.author.id}>, <@${user2.id}> didn't accept the duel!`
        );
      });
  }
};
