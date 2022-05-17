const TankTacticsSchema = require("../database/schemas/TankTactics");
const Discord = require("discord.js");
const perlinNoise = require("../packages/perlinnoise");
const Canvas = require("canvas");
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
        this.data.push(doc);

        //Get the timeout for the next event
        let nextEvent = this.getNextEvent(doc);
        if (nextEvent) {
          let timeout = setTimeout(() => {
            this.handleEvent(doc);
          }, nextEvent.timeout);

          this.timeouts.set(doc.channelId, timeout);
        }
      });
    });
  }

  //Events
  async interactionCreate(interaction) {
    if (interaction.customId) {
      interaction.user = interaction.member;
      interaction.user.userId = interaction.user.id;
      
      if (interaction.customId == "right") {
        let game = await this.getGame(interaction.channelId);
        if (!this.getUser(interaction.channel.id , interaction.user.id)) 
          return await interaction.reply({content: `You are not in this game. \n Try joining the game instead`,ephemeral: true});
        let user = interaction.user;
        this.move(game, user, "right", interaction);
      } else if (interaction.customId == "left") {
        let game = await this.getGame(interaction.channelId);
        let user = interaction.user;
        if (!this.getUser(interaction.channel.id , interaction.user.id)) 
          return await interaction.reply({content: `You are not in this game. \n Try joining the game instead`,ephemeral: true});
        this.move(game, user, "left", interaction);
      } else if (interaction.customId == "up") {
        let game = await this.getGame(interaction.channelId);
        let user = interaction.user;
        if (!this.getUser(interaction.channel.id , interaction.user.id)) 
          return await interaction.reply({content: `You are not in this game. \n Try joining the game instead`,ephemeral: true});
        this.move(game, user, "up", interaction);
      } else if (interaction.customId == "down") {
        let game = await this.getGame(interaction.channelId);
        let user = interaction.user;
        if (!this.getUser(interaction.channel.id , interaction.user.id)) 
          return await interaction.reply({content: `You are not in this game. \n Try joining the game instead`,ephemeral: true});
        this.move(game, user, "down", interaction);
      } else if (interaction.customId == "heal") {
        let game = await this.getGame(interaction.channelId);
        let user = interaction.user;
        if (!this.getUser(interaction.channel.id , interaction.user.id)) 
          return await interaction.reply({content: `You are not in this game. \n Try joining the game instead`,ephemeral: true});
        this.heal(game, user, interaction);
      } else if (interaction.customId == "give") {
        let game = await this.getGame(interaction.channelId);
        let user = interaction.user;
        if (!this.getUser(interaction.channel.id , interaction.user.id)) 
          return await interaction.reply({content: `You are not in this game. \n Try joining the game instead`,ephemeral: true});
        this.getGiveOptions(game, user, interaction);
      } else if (interaction.customId == "attack") {
        let game = await this.getGame(interaction.channelId);
        let user = interaction.user;
        if (!this.getUser(interaction.channel.id , interaction.user.id)) 
          return await interaction.reply({content: `You are not in this game. \n Try joining the game instead`,ephemeral: true});

        this.getAttackOptions(game, user, interaction);
      } else if (interaction.customId == "join") {
        let game = await this.getGame(interaction.channelId);
        let user = interaction.user;
        this.join(game, user, interaction);
      }
    }
  }

  async messageCreate(message) {}

  getNextEvent(doc) {
    //Get current time in milliseconds
    let now = new Date().getTime();

    //Get the next event
    let nextEvent = Number("" + doc.event.nextTimestamp);

    //Return the difference between now and the next event
    return nextEvent - now > 0 ? nextEvent - now : 0;
  }

  async handleEvent(doc) {
    if (doc.nextEvent.nextType == "wait") {
      //End the game
      doc.logs.push(`Game has ended due to inactivity`);
      await this.updateGame(doc, true);

      //Delete the game
      this.deleteGame(doc.channelId);
    } else if (doc.nextEvent.nextType == "start") {
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
    } else if (doc.nextEvent.nextType == "AP") {
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

  //Game

  async updateGame(game, mentionAllUsers) {


    //Get the guild
    let channel = await this.client.channels.fetch(game.channelId);
    let guild =  channel.guild;

    //Create the canvas
    let width = game.boardSize * 18;
    let height = game.boardSize * 18;
    let canvas = new Canvas( width, height );

    //Make the background white
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);

    //Draw the board
    ctx.fillStyle = "white";
    for (let i = 0; i < game.boardSize; i++) {
      for (let j = 0; j < game.boardSize; j++) {
        ctx.fillRect(i * 18, j * 18, 16, 16);
      }
    }


    //Draw the players
    for (let i = 0; i < game.users.length; i++) {
      let user = game.users[i];
      let x = user.x;
      let y = user.y;
      
      //Fetch the user
      let member=guild.members.fetch(user.userId);
      let avatar=member.user.avatarURL({format: "png", size: 16});
      let u=await this.client.users.fetch(user.userId,{force:true});

      let image = await Canvas.loadImage(avatar);
      ctx.drawImage(image, x * 18, y * 18, 16, 16);

      //Draw the range

      ctx.strokeStyle  =u.hexAccentColor;

      ctx.strokeRect((x-range)*18 -1, (y-range)*18-1, (x+range)*18+1, (y+range)*18+1);
    }

    let content=``
    if(mentionAllUsers){
      //Loop through all users
      for (let i = 0; i < game.users.length; i++) {
        content+=`<@${game.users[i].userId}> `;
      }

    }

    content+=`\n > ${game.logs.length > 0 ? game.logs[game.logs.length - 1] : ""}`;

    let description=`${game.users.length} players\n${game.boardSize}x${game.boardSize}`;
    if(game.nextEvent.nextType=="AP")
      description+=`\nNext event: \`Action points Donation\` in <t:${game.nextEvent.nextTimestamp}:>`;
    else if(game.nextEvent.nextType=="wait")
      description+=`\nWaiting for players to join`;
    else if(game.nextEvent.nextType=="start")
      description+=`\nNext event: \`Game start\` in <t:${game.nextEvent.nextTimestamp}:>`;

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(),'board.png'); 
    let embed= new Discord.MessageEmbed().setTitle(`<a:tank:975792552806588506> Tank Tactics`).setDescription(description).setColor(0x00AE86).setFooter(`Last game update at <t:${Date.now()}:>`).setImage('attachment://board.png');

    //Loop though all users
    for (let i = 0; i < game.users.length; i++) {
      let member=guild.members.cache.get(user.userId);

      let actionPointText=``;
      let healthText=``;
  
      for(let j=0;j<game.users[i].actionPoints;j++)
        actionPointText+=`<a:BlueCoin:976053896982196254>`;
      
      for(let j=0;j<game.users[i].health;j++)
        healthText+=`:heart:`;
      
      for(let j=0;j<3-game.users[i].health;j++)
        healthText+=`:black_heart:`;
      
      
      embed.addField(`${member.displayName}`,`**Action points:** ${actionPointText} \n **Health:** ${healthText} \n **Position:** ${game.users[i].x}x${game.users[i].y} \n **Range:** ${game.users[i].range}`);
    }


    let row=new Discord.MessageActionRow();
    let row2=new Discord.MessageActionRow();

    row.addComponents([
      new Discord.MessageButton().setCustomId('left').setEmoji('<:labs_left:976055411994153022>').setStyle('SECONDARY'),
      new Discord.MessageButton().setCustomId('up').setEmoji('<:labs_up:976055596438654976>').setStyle('SECONDARY'),
      new Discord.MessageButton().setCustomId('down').setEmoji('<:labs_down:976055697705951282>').setStyle('SECONDARY'),
      new Discord.MessageButton().setCustomId('right').setEmoji('<:labs_right:976055753259495444>').setStyle('SECONDARY'),
      new Discord.MessageButton().setCustomId('heal').setEmoji('<:health:976056237542232114>').setStyle('SECONDARY'),
    ])

    row2.addComponents([
      new Discord.MessageButton().setCustomId('range').setEmoji('<:range:976064452766081064>').setStyle('SECONDARY'),
      new Discord.MessageButton().setCustomId('attack').setEmoji('<:ATTACKER:976056587338801193>').setStyle('SECONDARY'),
      new Discord.MessageButton().setCustomId('give').setEmoji('<:donater:976056819162169365>').setStyle('SECONDARY'),
      new Discord.MessageButton().setCustomId('help').setEmoji('<:help:976057165263564851>').setStyle('SECONDARY'),
    ]);

    channel.send({embeds:[embed],files:[attachment],content:content,components:[row,row2]});
  }

  async getGame(channelId) {
    let g = this.data.find((game) => {
      return game.channelId == channelId;
    });

    if (!g) {
      g = await this.createGame(channelId);
    }

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
    return game.users.find((user) => {
      return user.userId == userId;
    });
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
    timeout = setTimeout(() => {
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
    if(game.open) return interaction.reply({content:`The game has not started yet.`,ephemeral:true});
    let options = [];
    //Get the user
    let player = await this.getUser(game.channelId, user.id);

    if(player.health==0){
      interaction.reply({ content: `Dead players cannot attack`,ephemeral:true });
      return;
    }

    //Loop through all users
    for (let i = 0; i < game.users.length; i++) {
      if (game.users[i].userId != user.userId) {
        if (game.users[i].userId!= 0) {
          if (this.checkIfInRange(player, game.users[i])) {
            options.push(game.users[i]);
          }
        }
      }
    }

    if(options.length == 0){
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
    if(game.open) return interaction.reply({content:`The game has not started yet.`,ephemeral:true});
    //Find the user
    let userIndex = game.users.findIndex((u) => {
      return u.userId == user.userId;
    });

    let player = game.users[userIndex];

    if(player.health==0){
      interaction.reply({ content: `Dead players cannot attack`,ephemeral:true });
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
    if(game.open) return interaction.reply({content:`The game has not started yet.`,ephemeral:true});
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

    if(options.length == 0){
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
    if(game.open) return interaction.reply({content:`The game has not started yet.`,ephemeral:true});
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
    if(game.open) return interaction.reply({content:`The game has not started yet.`,ephemeral:true});
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
    if(game.open) return interaction.reply({content:`The game has not started yet.`,ephemeral:true});
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
    if(game.open) return interaction.reply({content:`The game has not started yet.`,ephemeral:true});
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
      let player = this.getUser(game.channelId, user.id);
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
          //Set the timpstamp for the next event to be now + 3 hour
          game.event.nextTimestamp = Date.now() + 1000 * 60 * 60 * 3;

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
