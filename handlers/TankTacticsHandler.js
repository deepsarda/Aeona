const TankTacticsSchema = require("../database/schemas/TankTactics");

module.exports = class TankTacticsHandler {

    constructor(client) {
        this.client = client;
        client.tankTacticsHandler = this;

        this.client.on("interactionCreate", this.interactionCreate.bind(this));
        
    }

    async interactionCreate(interaction) {
       
    }
}
