const TankTacticsSchema = require("../database/schemas/TankTactics");
const Discord = require("discord.js");
const perlinNoise = require("../packages/perlinnoise");
const Canvas = require("canvas");
const getColors = require("../packages/imagecolors");
const paginationEmbed = require("discordjs-button-pagination");
const { MessageEmbed, MessageButton } = require("discord.js");

module.exports = class TankTacticsHandler {
  constructor(client) {
    this.client = client;
    client.tankTacticsHandler = this;
    this.timeouts = new Discord.Collection();
    this.client.on("interactionCreate", (interaction) => {
      this.interactionCreate(interaction);
    });
    this.client.on("messageCreate", (message) => {
      this.messageCreate(message);
    });

    this.channels = [];
    this.data = [];

    TankTacticsSchema.find({}, (err, docs) => {
      if (err) {
        console.log(err);
        return;
      }
      this.data = docs;
      this.data.forEach((doc) => {
        this.channels.push(doc.channelId);

        //Get the timeout for the next event
        let nextEvent = this.getNextEvent(doc);
        if (nextEvent) {
          let timeout = setTimeout(() => {
            this.handleEvent(doc);
          }, nextEvent);

          this.timeouts.set(doc.channelId, timeout);
        }
      });
    });
  }

  //Event Functions
  async onAction(channel, user, inter) {
    const game = await this.getGame(channel.id);

    if (!this.getUser(channel.id, user.id)) {
      await inter.reply({
        content:
          "Oops! Looks like you're not in this game.\n**Join** the game before performing an action 😅",
        ephemeral: true,
      });
      return false;
    }

    return game;
  }

  async onMiscAction(channel, user, inter, type) {
    actions = {
      heal: this.heal,
      give: this.getGiveOptions,
      attack: this.getAttackOptions,
      join: this.join,
    };

    const game = await this.onAction(channel, user, inter);

    if (!game) return;

    actions[type](game, user, inter);
  }

  async onHeal(channel, user, inter) {
    await this.onMiscAction(channel, user, inter, "heal");
  }

  async onGive(channel, user, inter) {
    await this.onMiscAction(channel, user, inter, "give");
  }

  async onAttack(channel, user, inter) {
    await this.onMiscAction(channel, user, inter, "attack");
  }

  async onJoin(channel, user, inter) {
    await this.onMiscAction(channel, user, inter, "join");
  }

  async onMovement(channel, user, inter, type) {
    const game = await this.onAction(channel, user, inter);

    if (!game) return;

    this.move(game, user, type, inter);
  }

  async onLeft(channel, user, inter) {
    await this.onMovement(channel, user, inter, "left");
  }

  async onRight(channel, user, inter) {
    await this.onMovement(channel, user, inter, "right");
  }

  async onUp(channel, user, inter) {
    await this.onMovement(channel, user, inter, "up");
  }

  async onDown(channel, user, inter) {
    await this.onMovement(channel, user, inter, "down");
  }

  //Events
  async interactionCreate(interaction) {
    if (interaction.customId) {
      interaction.user = interaction.member;
      interaction.user.userId = interaction.user.id;

      if (interaction.customId === "left")
        await this.onLeft(interaction.channel, interaction.user, interaction);
      else if (interaction.customId === "right")
        await this.onRight(interaction.channel, interaction.user, interaction);
      else if (interaction.customId === "up")
        await this.onUp(interaction.channel, interaction.user, interaction);
      else if (interaction.customId === "down")
        await this.onDown(interaction.channel, interaction.user, interaction);
      else if (interaction.customId === "heal")
        await this.onHeal(interaction.channel, interaction.user, interaction);
      else if (interaction.customId === "give")
        await this.onGive(interaction.channel, interaction.user, interaction);
      else if (interaction.customId === "attack")
        await this.onAttack(interaction.channel, interaction.user, interaction);
      else if (interaction.customId === "join")
        await this.onJoin(interaction.channel, interaction.user, interaction);
      else if (interaction.customId == "help") this.help(interaction);
    }
  }

  async messageCreate(message) {}

  getNextEvent(doc) {
    //Get current time in milliseconds
    let now = new Date().getTime();

    //Get the next event
    let event = Number("" + doc.event.nextTimestamp);

    //Return the difference between now and the next event
    return event - now > 0 ? event - now : 0;
  }

  async handleEvent(doc) {
    if (doc.event.nextType == "wait") {
      //End the game
      doc.logs.push(`Game has ended due to inactivity`);
      await this.updateGame(doc, true);

      //Delete the game
      this.deleteGame(doc.channelId);
    } else if (doc.event.nextType == "start") {
      //Start the game
      doc.logs.push(`Game has started`);
      doc.open = false;
      //Loop through all users
      for (let i = 0; i < doc.users.length; i++) {
        if (Math.floor(Math.random() * 24) < doc.users[i].hoursPassed + 1) {
          doc.users[i].actionPoints += 1;
          doc.users[i].hoursPassed = 0;
        } else {
          doc.users[i].hoursPassed += 1;
        }
      }

      //Reset the event
      doc.event.nextType = "AP";
      //Set the timpstamp for the next event to be now + 1 hour
      doc.event.nextTimestamp = Date.now() + 1000 * 60 * 60;

      //Set the timeout for the next event
      let timeout = this.timeouts.get(doc.channelId);
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => {
        this.handleEvent(doc);
      }, this.getNextEvent(doc));

      this.timeouts.set(doc.channelId, timeout);

      await doc.save();

      //Update the game
      await this.updateGame(doc, true);
    } else if (doc.event.nextType == "AP") {
      //Loop through all users
      let logs = ``;
      for (let i = 0; i < doc.users.length; i++) {
        if (Math.floor(Math.random() * 24) < doc.users[i].hoursPassed + 1) {
          doc.users[i].actionPoints += 1;
          doc.users[i].hoursPassed = 0;
          logs += `<@${doc.users[i].userId}> has gained 1 action point.\n`;
        } else {
          doc.users[i].hoursPassed += 1;
        }
      }

      //Reset the event
      doc.event.nextType = "AP";
      //Set the timpstamp for the next event to be now + 1 hour
      doc.event.nextTimestamp = Date.now() + 1000 * 60 * 60;

      //Set the timeout for the next event
      let timeout = this.timeouts.get(doc.channelId);
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => {
        this.handleEvent(doc);
      }, this.getNextEvent(doc));

      this.timeouts.set(doc.channelId, timeout);

      docs.logs.push(logs);
      await doc.save();

      //Update the game
      await this.updateGame(doc, false);
    }
  }

  async help(interaction) {
    const embed1 = new MessageEmbed()
      .setTitle("What is this?")
      .setDescription("An Idle co-op staregy game.");

    const embed2 = new MessageEmbed()
      .setTitle("What is the goal?")
      .setDescription(
        "The goal of the game is to survive as long as possible."
      );

    const embed3 = new MessageEmbed()
      .setTitle("How do I join?")
      .setDescription(
        " To join the game, type `+join` or click the join button in the game menu."
      );

    const embed4 = new MessageEmbed()
      .setTitle("How do I start the game?")
      .setDescription(
        "The game will start automatically when the fourth player joins. There will a 6 hr wait period before the game starts to allow for more players to join."
      );

    const embed5 = new MessageEmbed()
      .setTitle("What are action points?")
      .setDescription(
        "Action points are used to perform actions in the game. Each action point is used to perform one of the following actions: \n - Move \n - Heal \n - Attack \n - Give \n -Range\n\n Action points are given randomly every day. \n Action points are given to dead player at a higher frequency. The alive players have to negociate with the dead players to get more action points. \n ** The  best way to win is to have the most number of dead player on your side.** As they decide who will win very often"
      );

    const embed6 = new MessageEmbed()
      .setTitle("What are the actions?")
      .setDescription(
        "The actions are as follows: \n - Move: Move to up,down,left right \n - Heal: Heal yourself \n - Attack: Attack a random player \n - Give: Give a random player an action point  \n - Range Upgrade the range of your tank! "
      );

    const embed7 = new MessageEmbed()
      .setTitle("How do I move?")
      .setDescription(
        "To move, type `+right`, `+left`, `+up`, or `+down` in the chat or alternatively click the  button in the game menu."
      )
      .setImage(
        "https://cdn.discordapp.com/attachments/942118536166383717/976143154917048370/unknown.png?size=4096"
      );

    const embed8 = new MessageEmbed()
      .setTitle("How do I heal?")
      .setDescription(
        "To heal, type `+heal` in the chat or alternatively click the  button in the game menu. Healing has a 10% chance of working."
      )
      .setImage(
        "https://media.discordapp.net/attachments/942118536166383717/976143343375507546/unknown.png"
      );

    const embed9 = new MessageEmbed()
      .setTitle("How do I attack?")
      .setDescription(
        "To attack, type `+attack` in the chat or alternatively click the  button in the game menu. You can only attack as far as your range. Which is indicated by the square around you."
      )
      .setImage(
        "https://media.discordapp.net/attachments/942118536166383717/976143931152687104/unknown.png"
      );

    const embed10 = new MessageEmbed()
      .setTitle("How do I give?")
      .setDescription(
        "To give, type `+give` in the chat or alternatively click the  button in the game menu. You can only give as far as your range. Which is indicated by the square around you. Unless you are dead then you can give to anyone."
      )
      .setImage(
        "https://media.discordapp.net/attachments/942118536166383717/976145099224395777/unknown.png"
      );
    const embed11 = new MessageEmbed()
      .setTitle("How do I upgrade range?")
      .setDescription("To upgrade range, click the  button in the game menu. ")
      .setImage(
        "https://media.discordapp.net/attachments/942118536166383717/976144960036409394/unknown.png"
      );
    
    const embed12 = new MessageEmbed()
      .setTitle("Communication")
      .setDescription( `Key to win is to communicate with different players form alliances. You can dm players to talk to them.`)
    const button1 = new MessageButton()
      .setCustomId("previousbtn")
      .setLabel("Previous")
      .setStyle("DANGER");

    const button2 = new MessageButton()
      .setCustomId("nextbtn")
      .setLabel("Next")
      .setStyle("SUCCESS");
    let pages = [
      embed1,
      embed2,
      embed3,
      embed4,
      embed5,
      embed6,
      embed7,
      embed8,
      embed9,
      embed10,
      embed11,
      embed12
    ];

    let buttonList = [button1, button2];
    paginationEmbed(interaction, pages, buttonList, 60 * 1000 * 5);
  }
  //Game

  async updateGame(game, mentionAllUsers, showContent) {
    if (showContent === undefined) showContent = true;
    //Get the guild
    let channel = await this.client.channels.fetch(game.channelId);
    let guild = channel.guild;

    //Create the canvas
    let width = game.boardSize * 20;
    let height = game.boardSize * 20;
    let canvas = Canvas.createCanvas(width, height);

    //Make the background white
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = "#414245";
    ctx.fillRect(0, 0, width, height);

    //Draw the board
    ctx.fillStyle = "#b2e4ed";
    for (let i = 0; i < game.boardSize; i++) {
      for (let j = 0; j < game.boardSize; j++) {
        ctx.fillRect(i * 20, j * 20, 16, 16);
      }
    }
    let colorsUsed = [];
    //Draw the players
    for (let i = 0; i < game.users.length; i++) {
      let user = game.users[i];
      let x = user.x;
      let y = user.y;

      //Fetch the user
      let member;
      try {
        member = await guild.members.fetch(user.userId);
      } catch (e) {
        game.users.splice(i, 1);
        await game.save();
        continue;
      }

      let avatar = member.displayAvatarURL({ format: "png", size: 16 });
      let avatar128 = member.displayAvatarURL({ format: "png", size: 1024 });
      let image = await Canvas.loadImage(avatar);
      getColors(avatar128).then((colors) => {
        //Loop through the colors and find the one with the highest amount
        let color;
        let max = 0;

        for (let i = 0; i < colors.length; i++) {
          let c = colors[i];
          if (colorsUsed.includes(c.color.hex())) continue;

          if (c.amount > max) {
            max = c.amount;
            color = c.color.hex();
          }
        }

        ctx.strokeStyle = color;
      });

      ctx.drawImage(image, x * 20, y * 20, 16, 16);

      ctx.lineWidth = 8;

      ctx.beginPath();
      ctx.strokeRect(
        (x - user.range) * 20 - 1,
        (y - user.range) * 20 - 1,
        user.range * 2 * 20 + 20,
        user.range * 2 * 20 + 20
      );
      ctx.stroke();
    }

    let content = ``;
    if (mentionAllUsers) {
      //Loop through all users
      for (let i = 0; i < game.users.length; i++) {
        content += `<@${game.users[i].userId}> `;
      }
    }

    content += `\n > ${
      game.logs.length > 0 ? game.logs[game.logs.length - 1] : ""
    }`;

    let description = `** ${game.users.length} players** \n** Board Size **: ${game.boardSize}x${game.boardSize}`;
    if (game.event.nextType == "AP")
      description += `\n** Next event: \`Action points Donation\` in <t:${Math.floor(
        game.event.nextTimestamp / 1000
      )}:R>**  `;
    else if (game.event.nextType == "wait")
      description += `\n** Waiting for players to join** `;
    else if (game.event.nextType == "start")
      description += `\n** Next event: \`Game start\` in <t:${Math.floor(
        game.event.nextTimestamp / 1000
      )}:R>** `;

    description += `\n\n\n`;

    //Loop though all users
    for (let i = 0; i < game.users.length; i++) {
      let member = guild.members.cache.get(game.users[i].userId);
      if (!member) continue;
      let actionPointText = ``;
      let healthText = ``;

      for (let j = 0; j < game.users[i].actionPoints; j++)
        actionPointText += `<a:BlueCoin:976053896982196254>`;

      for (let j = 0; j < game.users[i].health; j++) healthText += `:heart:`;

      for (let j = 0; j < 3 - game.users[i].health; j++)
        healthText += `:black_heart:`;

      description +=
        `\n\n**${member}** \n\n` +
        `**Action points:** ${actionPointText} \n **Health:** ${healthText} \n **Position:** ${game.users[i].x}x${game.users[i].y} \n **Range:** ${game.users[i].range}`;
    }

    const attachment = new Discord.MessageAttachment(
      canvas.toBuffer(),
      "board.png"
    );

    let embed = new Discord.MessageEmbed()
      .setTitle(`<a:tank:975792552806588506> Tank Tactics`)
      .setDescription(description)
      .setColor(0x00ae86)
      .setFooter(`Current map: ${game.boardSize}x${game.boardSize}`)
      .setImage("attachment://board.png");

    let row = new Discord.MessageActionRow();
    let row2 = new Discord.MessageActionRow();

    row.addComponents([
      new Discord.MessageButton()
        .setCustomId("left")
        .setEmoji("<:labs_left:976055411994153022>")
        .setStyle("SECONDARY"),
      new Discord.MessageButton()
        .setCustomId("up")
        .setEmoji("<:labs_up:976055596438654976>")
        .setStyle("SECONDARY"),
      new Discord.MessageButton()
        .setCustomId("down")
        .setEmoji("<:labs_down:976055697705951282>")
        .setStyle("SECONDARY"),
      new Discord.MessageButton()
        .setCustomId("right")
        .setEmoji("<:labs_right:976055753259495444>")
        .setStyle("SECONDARY"),
      new Discord.MessageButton()
        .setCustomId("heal")
        .setEmoji("<:health:976056237542232114>")
        .setStyle("SECONDARY"),
    ]);

    row2.addComponents([
      new Discord.MessageButton()
        .setCustomId("range")
        .setEmoji("<:range:976064452766081064>")
        .setStyle("SECONDARY"),
      new Discord.MessageButton()
        .setCustomId("attack")
        .setEmoji("<:ATTACKER:976056587338801193>")
        .setStyle("SECONDARY"),
      new Discord.MessageButton()
        .setCustomId("give")
        .setEmoji("<:donater:976056819162169365>")
        .setStyle("SECONDARY"),
      new Discord.MessageButton()
        .setCustomId("help")
        .setEmoji("<:help:976057165263564851>")
        .setStyle("SECONDARY"),
      new Discord.MessageButton()
        .setCustomId("join")
        .setLabel("Join")
        .setStyle("SECONDARY"),
    ]);

    await channel.send({
      embeds: [embed],
      files: [attachment],
      content: showContent ? content : "_ _",
      components: [row, row2],
    });

    channel.send(
      "** TO JOIN**: Click the join button! \n **Learn how to play**: click on the button marked with <:help:976057165263564851> "
    );
  }

  async getGame(channelId) {
    let g = this.data.find((game) => {
      return game.channelId == channelId;
    });

    return g;
  }

  async deleteGame(channelId) {
    let g = this.data.find((game) => {
      return game.channelId == channelId;
    });

    if (g) {
      this.data.splice(this.data.indexOf(g), 1);
      this.channels.splice(this.channels.indexOf(channelId), 1);
      clearTimeout(this.timeouts.get(channelId));
    }

    //Delete from database
    TankTacticsSchema.deleteOne({ channelId: channelId }, (err) => {
      if (err) {
        console.log(err);
        return;
      }
    });
  }
  async getUser(channelId, userId) {
    let game = await this.getGame(channelId);

    if (!game) return;

    let user = null;
    for (let i = 0; i < game.users.length; i++) {
      if (game.users[i].userId == userId) {
        user = game.users[i];
      }
    }

    return user;
  }

  async createGame(channelId) {
    let game = new TankTacticsSchema({
      channelId: channelId,
      seed: Math.floor(Math.random() * 100000),
      users: [],
      boardSize: 32,
      open: true,
      event: {
        nextType: "wait",
        nextTimestamp: Date.now() + 1000 * 60 * 60 * 24 * 7,
      },
    });

    await game.save();

    this.channels.push(channelId);
    this.data.push(game);

    // Set the timeout for the next event
    let timeout = setTimeout(() => {
      this.handleEvent(game);
    }, this.getNextEvent(game));

    this.timeouts.set(game.channelId, timeout);

    return await this.getGame(channelId);
  }

  checkIfInRange(user, target) {
    let distancex = Math.abs(user.x - target.x);
    let distancey = Math.abs(user.y - target.y);

    //are they in range?
    if (distancex <= range && distancey <= range) {
      return true;
    }
    return false;
  }
  //Attack

  async getAttackOptions(game, user, interaction) {
    if (game.open)
      return interaction.reply({
        content: `The game has not started yet.`,
        ephemeral: true,
      });
    let options = [];
    //Get the user
    let player = await this.getUser(game.channelId, user.id);

    if (player.health == 0) {
      interaction.reply({
        content: `Dead players cannot attack`,
        ephemeral: true,
      });
      return;
    }

    //Loop through all users
    for (let i = 0; i < game.users.length; i++) {
      if (game.users[i].userId != user.userId) {
        if (game.users[i].userId != 0) {
          if (this.checkIfInRange(player, game.users[i])) {
            options.push(game.users[i]);
          }
        }
      }
    }

    if (options.length == 0) {
      interaction.reply({
        content: `You can't attack  anyone.`,
        ephemeral: true,
      });
    }
    let guild = await this.client.channels.fetch(game.channelId);
    guild = guild.guild;

    let selectOptions = [];
    //Loop through all users
    for (let i = 0; i < options.length; i++) {
      //Get the member based on the user id
      let member = await guild.members.fetch(options[i].userId);
      selectOptions.push({
        label: `${member.displayName}`,
        value: `${options[i].userId}`,
      });
    }

    let row = new Discord.MessageActionRow();
    new Discord.MessageSelectMenu()
      .setCustomId("select")
      .setPlaceholder("Select which user!")
      .setOptions(selectOptions);

    let m = await interaction.reply({
      content: "Select which user you want to attack!",
      components: [row],
      ephemeral: true,
    });
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 60000 * 10,
    });
    const filter = (i) =>
      i.user.id === interaction.user.id && i.message.id === m.id;

    collector.on("collect", async (i) => {
      this.attack(
        game,
        user,
        await this.getUser(interaction.channel.id, i.values[0]),
        i
      );
    });

    collector.on("end", async (collected) => {
      await m.delete();
    });
  }

  async attack(game, user, enemy, interaction) {
    if (game.open)
      return interaction.reply({
        content: `The game has not started yet.`,
        ephemeral: true,
      });
    //Find the user
    let userIndex = game.users.findIndex((u) => {
      return u.userId == user.userId;
    });

    let player = game.users[userIndex];

    if (player.health == 0) {
      interaction.reply({
        content: `Dead players cannot attack`,
        ephemeral: true,
      });
      return;
    }
    //Check if the user has enough action points
    if (player.actionPoints < 1) {
      interaction.reply({
        content: `You don't have enough action points to attack.`,
        ephemeral: true,
      });

      return;
    }

    //Find the enemy
    let enemyIndex = game.users.findIndex((u) => {
      return u.userId == enemy.userId;
    });

    let enemyUser = game.users[enemyIndex];

    //Reduce the user's action points
    game.users[userIndex].actionPoints -= 1;

    //Attack the enemy
    game.users[enemyIndex].health -= 1;

    //Check if the enemy is dead
    if (game.users[enemyIndex].health <= 0) {
      let economyUser = await this.client.economy.getUser(user.id);
      economyUser.kills += 1;
      await economyUser.save();

      //Enemys economy
      let economyEnemy = await this.client.economy.getUser(enemy.userId);
      economyEnemy.deaths += 1;
      await economyEnemy.save();
      //Check how many enemies are left
      let enemiesLeft = game.users.filter((u) => {
        return u.health > 0;
      });

      if (enemiesLeft.length == 1) {
        //The user has won
        game.logs.push(
          `<@${user.userId}> has won the game by killing <@${enemy.userId}>`
        );
        game.open = false;

        //Update the economy
        economyUser.wins += 1;
        await economyUser.save();

        await game.save();

        //Update the game
        await this.updateGame(game, true);
      } else {
        //The user has not won
        game.logs.push(`<@${user.userId}> has killed <@${enemy.userId}>`);

        await game.save();

        //Update the game
        await this.updateGame(game, false);
      }
    } else {
      game.logs.push(`<@${user.userId}> has attacked <@${enemy.userId}>`);
      //Save the game
      await game.save();

      //Update the game
      await this.updateGame(game, false);
    }
  }

  //give
  async getGiveOptions(game, user, interaction) {
    if (game.open)
      return interaction.reply({
        content: `The game has not started yet.`,
        ephemeral: true,
      });
    let options = [];
    //Get the user
    let player = await this.getUser(game.channelId, user.id);
    //Loop through all users
    for (let i = 0; i < game.users.length; i++) {
      if (game.users[i].userId != user.userId) {
        if (player.health == 0) {
          options.push(game.users[i]);
        } else {
          //Check if the user is in range
          if (this.checkIfInRange(player, game.users[i])) {
            options.push(game.users[i]);
          }
        }
      }
    }

    if (options.length == 0) {
      interaction.reply({
        content: `You can't give to anyone.`,
        ephemeral: true,
      });
    }
    let guild = await this.client.channels.fetch(game.channelId);
    guild = guild.guild;

    let selectOptions = [];
    //Loop through all users
    for (let i = 0; i < options.length; i++) {
      //Get the member based on the user id
      let member = await guild.members.fetch(options[i].userId);
      selectOptions.push({
        label: `${member.displayName}`,
        value: `${options[i].userId}`,
      });
    }

    let row = new Discord.MessageActionRow();
    new Discord.MessageSelectMenu()
      .setCustomId("select")
      .setPlaceholder("Select which user!")
      .setOptions(selectOptions);

    let m = await interaction.reply({
      content: "Select which user you want to give to!",
      components: [row],
      ephemeral: true,
    });
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 60000 * 10,
    });
    const filter = (i) =>
      i.user.id === interaction.user.id && i.message.id === m.id;

    collector.on("collect", async (i) => {
      this.give(
        game,
        user,
        await this.getUser(interaction.channel.id, i.values[0]),
        i
      );
    });

    collector.on("end", async (collected) => {
      await m.delete();
    });
  }

  async give(game, user, enemy, interaction) {
    if (game.open)
      return interaction.reply({
        content: `The game has not started yet.`,
        ephemeral: true,
      });
    //Find the user
    let userIndex = game.users.findIndex((u) => {
      return u.userId == user.id;
    });

    let player = game.users[userIndex];

    //Check if the user has enough action points
    if (player.actionPoints < 1) {
      interaction.reply({
        content: `You don't have enough action points to give.`,
        ephemeral: true,
      });

      return;
    }

    //Find the enemy
    let enemyIndex = game.users.findIndex((u) => {
      return u.userId == enemy.userId;
    });

    //Reduce the user's action points
    game.users[userIndex].actionPoints -= 1;

    //Attack the enemy
    game.users[enemyIndex].actionPoints += 1;

    //Update the economy
    let economyUser = await this.client.economy.getUser(user.id);
    economyUser.donations += 1;
    await economyUser.save();

    interaction.reply({
      content: `You have given <@${enemy.userId}> an action point.`,
      ephemeral: true,
    });

    game.logs.push(
      `<@${user.userId}> has given <@${enemy.userId}> an action point.`
    );
    //Save the game
    await game.save();

    //Update the game
    await this.updateGame(game, false);
  }

  //heal
  async heal(game, user, interaction) {
    if (game.open)
      return interaction.reply({
        content: `The game has not started yet.`,
        ephemeral: true,
      });
    //Find the user
    let userIndex = game.users.findIndex((u) => {
      return u.userId == user.userId;
    });

    let player = game.users[userIndex];

    //Check if the user has enough action points
    if (player.actionPoints < 1) {
      interaction.reply({
        content: `You don't have enough action points to heal`,
        ephemeral: true,
      });

      return;
    }

    //Check if the user has enough health
    if (player.health >= 3) {
      interaction.reply({
        content: `You already have full health`,
        ephemeral: true,
      });

      return;
    }

    if (Math.floor(Math.random() * 100) < 10) {
      game.users[userIndex].health += 1;
      game.users[userIndex].actionPoints -= 1;

      game.logs.push(`${user.username} has been healed.`);
      interaction.reply({
        content: `You healed all your health`,
        ephemeral: true,
      });

      let economyUser = await this.client.economy.getUser(user.id);
      economyUser.heals += 1;
      await economyUser.save();

      await game.save();

      //Update the game
      await this.updateGame(game, false);
    } else {
      interaction.reply({
        content: `You where unable to heal yourself`,
        ephemeral: true,
      });
    }
  }

  //move
  async move(game, user, move, interaction) {
    if (game.open)
      return interaction.reply({
        content: `The game has not started yet.`,
        ephemeral: true,
      });
    //Find the user
    let userIndex = game.users.findIndex((u) => {
      return u.userId == user.id;
    });

    let player = game.users[userIndex];

    //Check if the user has enough action points
    if (player.actionPoints < 1) {
      interaction.reply({
        content: `You don't have enough action points to move`,
        ephemeral: true,
      });

      return;
    }

    if (move == "up") {
      if (player.y < game.boardSize - 1) {
        game.users[userIndex].y++;
        game.users[userIndex].actionPoints -= 1;
        game.logs.push(`<@${user.userId}> has moved up`);
      } else {
        interaction.reply({ content: `You cannot move up`, ephemeral: true });
        return;
      }
    } else if (move == "down") {
      if (player.y > 0) {
        game.users[userIndex].y--;
        game.users[userIndex].actionPoints -= 1;
        game.logs.push(`<@${user.userId}> has moved down`);
      } else {
        interaction.reply({ content: `You cannot move down`, ephemeral: true });
        return;
      }
    } else if (move == "left") {
      if (player.x > 0) {
        game.users[userIndex].x--;
        game.users[userIndex].actionPoints -= 1;
        game.logs.push(`<@${user.userId}> has moved left`);
      } else {
        interaction.reply({ content: `You cannot move left`, ephemeral: true });
        return;
      }
    } else if (move == "right") {
      if (player.x < game.boardSize - 1) {
        game.users[userIndex].x++;
        game.users[userIndex].actionPoints -= 1;
        game.logs.push(`<@${user.userId}> has moved right`);
      } else {
        interaction.reply({
          content: `You cannot move right`,
          ephemeral: true,
        });
        return;
      }
    }

    let economyUser = await this.client.economy.getUser(user.id);
    economyUser.moves += 1;
    await economyUser.save();

    await game.save();

    //Update the game
    await this.updateGame(game, false);
  }

  //range
  async range(game, user, interaction) {
    if (game.open)
      return interaction.reply({
        content: `The game has not started yet.`,
        ephemeral: true,
      });
    //Find the user
    let userIndex = game.users.findIndex((u) => {
      return u.userId == user.userId;
    });

    let player = game.users[userIndex];

    //Check if the user has enough action points
    if (player.actionPoints < 1) {
      interaction.reply({
        content: `You don't have enough action points to upgrade your range.`,
        ephemeral: true,
      });

      return;
    }

    game.users[userIndex].actionPoints -= 1;
    game.users[userIndex].range += 1;

    game.logs.push(`<@${user.userId}> has upgraded their range`);

    await game.save();

    //Update the game
    await this.updateGame(game, false);
  }
  //join
  async join(game, user, interaction) {
    if (game.open) {
      let player = await this.getUser(game.channelId, user.id);
      if (!player) {
        game.users.push({
          userId: user.id,
          x: Math.floor(Math.random() * game.boardSize),
          y: Math.floor(Math.random() * game.boardSize),
          health: 3,
          range: 2,
          actionPoints: 1,
          hoursPassed: 0,
        });

        let economyUser = await this.client.economy.getUser(user.id);
        economyUser.gameplayed += 1;
        await economyUser.save();

        if (game.users.length == 4) {
          game.event.nextType = "start";
          //Set the timpstamp for the next event to be now + 6 hour
          game.event.nextTimestamp = Date.now() + 1000 * 60 * 60 * 6;

          //Set the timeout for the next event
          let timeout = this.timeouts.get(game.channelId);
          if (timeout) {
            clearTimeout(timeout);
          }

          timeout = setTimeout(() => {
            this.handleEvent(game);
          }, this.getNextEvent(game));

          this.timeouts.set(game.channelId, timeout);

          game.logs.push(
            `The game is about to start as we have 4 players, the game will start in 3 hours as we wait for more players. \n Latest Join: ${user}`
          );
        } else if (game.users.length == 10) {
          game.event.nextType = "AP";
          //Set the timpstamp for the next event to be now + 1 hour
          game.event.nextTimestamp = Date.now() + 1000 * 60 * 60;

          game.open = false;

          //Set the timeout for the next event
          let timeout = this.timeouts.get(game.channelId);
          if (timeout) {
            clearTimeout(timeout);
          }

          timeout = setTimeout(() => {
            this.handleEvent(game);
          }, this.getNextEvent(game));

          this.timeouts.set(game.channelId, timeout);

          game.logs.push(`The game has started! \n Latest Join: ${user}`);
        } else {
          game.logs.push(`${user} has joined the game`);
        }
        await game.save();

        interaction.reply({
          content: "You have joined the game!",
          ephemeral: true,
        });

        await this.updateGame(game, true);
      } else {
        interaction.reply({
          content: "You are already in the game!",
          ephemeral: true,
        });
      }
    } else {
      interaction.reply({
        content: "The game is already started!",
        ephemeral: true,
      });
    }
  }
};
