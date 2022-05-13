const TankTacticsSchema = require("../database/schemas/TankTactics");

module.exports = class TankTacticsHandler {

    constructor(client) {
        this.client = client;
        client.tankTacticsHandler = this;

        this.client.on("interactionCreate", (interaction) => { this.interactionCreate(interaction); });
        this.client.on("messageCreate", (message) => { this.messageCreate(message); });


        this.channels=[];
        this.data=[];

        TankTacticsSchema.find({}, (err, docs) => {
            if(err) {
                console.log(err);
                return;
            }
            this.data = docs;
            this.data.forEach((doc) => {
                this.channels.push(doc.channelId);
                this.data.push(doc);

                //Get the timeout for the next event
                let nextEvent = this.getNextEvent(doc);
                if(nextEvent) {
                    this.client.setTimeout(() => {
                        this.handleEvent(doc);
                    }, nextEvent.timeout);
                }
            });
        });
    }

    async interactionCreate(interaction) {
        
    }

    async messageCreate(message) {
    }

    getNextEvent(doc) {
        //Get current time in milliseconds
        let now = new Date().getTime();

        //Get the next event
        let nextEvent= Number(doc.event.nextTimestamp);

        //Return the difference between now and the next event
        return nextEvent - now >0 ? nextEvent - now : 0;
    }
}
