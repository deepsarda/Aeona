import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'botinfo',
	description: 'Get information on the bot',
	commandType: ['application', 'message'],
	category: 'info',
	args: [],
	async execute(client: AeonaBot, ctx: Context) {
		const totalGuilds = client.cache.guilds.memory.size;
		const totalMembers = client.cache.members.memory.size;
		const totalChannels = client.cache.channels.memory.size;

		client.extras.embed(
			{
				title: `Bot information`,
				desc: `____________________________`,
				thumbnail: client.helpers.getAvatarURL(client.user.id + '', client.user.discriminator, {
					avatar: client.user.avatar,
				}),
				fields: [
					{
						name: 'Information ℹ️',
						value: `I am  a bot with which you can run your entire server! With plenty of commands and features, you can create the perfect discord experience.`,
						inline: false,
					},
					{
						name: 'Servers 🌐',
						value: `\`${totalGuilds}\` servers`,
						inline: true,
					},
					{
						name: 'Members 👥 ',
						value: `\`${totalMembers}\` members`,
						inline: true,
					},
					{
						name: 'Channels 📺',
						value: `\`${totalChannels}\` channels`,
						inline: true,
					},
					{
						name: 'Node.js Version 🏷',
						value: `\`${process.version}\``,
						inline: true,
					},
					{
						name: 'Using Discordeno 📂',
						value: `And Amethyst Framework`,
						inline: true,
					},
					{
						name: 'Bot memory 💾',
						value: `\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}\` MB`,
						inline: true,
					},
					{
						name: 'Special Thanks 💬',
						value: 'Green Bot Developers for letting us use their bot as our base.',
						inline: true,
					},
				],
			},
			ctx,
		);
	},
} as CommandOptions;
