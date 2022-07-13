module.exports = {
  name: "serverinfo",
  description: "View server info",
  usage: "+serverinfo",
  category: "info",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    let owner = await message.guild.fetchOwner();
    message.guild = await message.guild.fetch();
    return message.reply({
      title: `${message.guild.name} info`,
      description: `**ID:** ${message.guild.id}\n
            **Name:** ${message.guild.name}\n
            **Owner:** ${owner}\n
            **Created at:** <t:${message.guild.createdAtTimes()}:R>\n
            **Members:** ${message.guild.memberCount}\n
            **Channels:** ${message.guild.channels.cache.size}\n
            **Roles:** ${message.guild.roles.cache.size}\n
            **Emojis:** ${message.guild.emojis.cache.size}\n
            **Region:** ${message.guild.region}\n
            **Verified:** ${message.guild.verified}\n
            **Boost Tier:** ${message.guild.premiumTier}\n
            **Nitro Boosts:** ${message.guild.premiumSubscriptionCount}\n
            **Public Update Channel:** ${message.guide.publicUpdateChannel}\n
            **Public Update Channel ID:** ${
              message.guide.publicUpdateChannelId
            }\n
            **Rules Channel:** ${message.guide.rulesChannel}\n
            **Rules Channel ID:** ${message.guide.rulesChannelId}\n
            **System Channel:** ${message.guide.systemChannel}\n
            **System Channel ID:** ${message.guide.systemChannelId}\n
            **Banner Url:** ${message.guild.bannerURL({ dynamic: true })}\n
            `,
      thumbnailURL: message.guild.iconURL({ dynamic: true }),
    });
  },
};
