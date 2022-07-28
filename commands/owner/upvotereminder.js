const User= require("../../database/schemas/User");
module.exports = {
    name: "upvotereminder",
    description: "View a list of all commands",
    usage: "+upvotereminder <category>",
    category: "info",
    requiredArgs: 0,
    execute: async (message, args, bot, prefix) => {

        if(!message.client.developers.includes(message.author.id)) return;
        let users= await User.find({});
        for(let user of users){
            try{
                bot.users.fetch(user.discordId).then(async (u)=>{
                    if(u.lastVoted < Date.now() - (1000 * 60 * 60 * 24 * 7)){
                        await u.send(`Hello! This is a notification to let you know that you haven't voted for the bot in a week. Please vote for the bot to help it grow! https://top.gg/bot/931226824753700934/vote`);
                    }
                });

            }catch(err){
                console.log(err);
            }
        }
    }
}