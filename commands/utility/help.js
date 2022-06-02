module.exports = {
    name: "help",
    description: "View a list of all commands",
    usage: "+help",
    category: "utility",
    requiredArgs: 0,
    execute: async (message, args, bot, prefix) => {
        let modules = "";
        for (const category of bot.categories.keys())
            modules += `\`${category.charAt(0).toUpperCase()}${category.slice(1)}\` `;                    
        const m = await message.channel.send({
            title: "Help menu",
            description: `Select a module using the dropdown below, to view **it's tutorial** and **commands list**!\n\nAll available modules: ${modules}`
        });
    }
}