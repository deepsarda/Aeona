const TankTacticsSchema = require("../database/schemas/TankTactics");
const Discord=require('discord.js');
const perlinNoise=require('../packages/perlinnoise')
module.exports = class TankTacticsHandler {
  constructor(client) {
    this.client = client;
    client.tankTacticsHandler = this;
    this.timeouts=new Discord.Collection();
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
          let timeout=setTimeout(() => {
            this.handleEvent(doc);
          }, nextEvent.timeout);

          this.timeouts.set(doc.channelId,timeout);

        }
      });
    });
  }

  //Events
  async interactionCreate(interaction) {}

  async messageCreate(message) {}


  //Game
  getNextEvent(doc) {
    //Get current time in milliseconds
    let now = new Date().getTime();

    //Get the next event
    let nextEvent = Number(doc.event.nextTimestamp);

    //Return the difference between now and the next event
    return nextEvent - now > 0 ? nextEvent - now : 0;
  }

  
  async updateGame(game){

  }

  async getGame(channelId){

  }

  //Attack

  async getAttackOptions(game,user){

  }


  async attack(game,user,enemy){

  }

  //give
  async getGiveOptions(game,user){

  }


  async give(game,user,enemy){

  }

  //heal
  async heal(game,user){

  }

  //move
  async move(game,user,move){

  }


  //range
  async range(game,user){

  }
  //join
  async join(game,user){

  }

  

};
