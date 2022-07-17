const Guild = require("../../database/schemas/Guild");

module.exports = {
    name: "premium",
    description: "View a list of all aeona premium features",
    usage: "+premium",
    category: "config",
    requiredArgs: 0,
    permission: ["MANAGE_GUILD"],
    execute: async (message, args, bot, prefix) => {

        message.reply({
            title: "premium",
            description: `
            **Premium Features**
            - Verification
            - Custom Commands
            - Chat filter
            - Custom Chatbot
            - Customizable Suggestions
            - Server Tickets
            - Applications
            - Auto Responses
            - Polls
            - Alt Detection

            **Get Premium for your server for just $2.99 [here](https://aeona.xyz/premium)**
            `
        })
    }
}
