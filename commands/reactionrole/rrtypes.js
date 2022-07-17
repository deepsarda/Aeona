module.exports = {
  name: "rrtypes",
  description: "Create a reaction role",
  usage: "+rrtypes ",
  category: "reactionrole",
  requiredArgs: 0,
  premissions: ["MANAGE_ROLES"],
  execute: async (message, args, bot, prefix) => {
    message.reply({
      title: "Reaction Role",
      description: `\`Type 1\` - React adds the role, unreacting removes the role\n\`Type 2\` - Reacting will give the role but unreaction won't remove the role\n\`Type 3\` - Reacting will remove the user's role and unreacting won't give it back\n\`Type 4\` - When reacting it will remove the role, unreacting will add the role\n\`Type 5\` - Same concept as number 3 but removes the user's reaction\n\`Type 6\` - React to recieve the role and react again to remove the role`,
    });
  },
};
