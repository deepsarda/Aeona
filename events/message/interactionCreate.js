module.exports = {
    name: "interactionCreate",
    async execute(client, interaction) {

        if(interaction.customId){
            if(interaction.customId=="close"){
                cmd = message.client.commands.get("close");
                cmd.execute(interaction, [], client, "");
            }else if(interaction.customId=="claim"){
                cmd = message.client.commands.get("claim");
                cmd.execute(interaction, [], client, "");
            }
        }
    }
}