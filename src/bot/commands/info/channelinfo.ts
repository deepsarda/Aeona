import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'channelinfo',
	description: 'channelinfo',
	commandType: ['application', 'message'],
	category: 'info',
	args: [
		{
			name: 'channel',
			description: 'Channel to get details of',
			required: true,
			type: 'Ctring',
		},
	],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild+" "+ctx.channel+" "+ctx.user);
		const channel = await ctx.options.getChannel('channel', true);
		if (!channel) return;
		client.extras.embed(
			{
				title: `Channel information`,
				desc: `Channel information about: <#${channel.id}>`,
				fields: [
					{
						name: 'Type',
						value: `${channel.type}`,
						inline: true,
					},
					{
						name: 'ID',
						value: `${channel.id}`,
						inline: true,
					},
					{
						name: 'Type',
						value: `${channel.type}`,
						inline: true,
					},
					{
						name: 'Made on',
						value: `<t:${channel.createTimestamp}>`,
						inline: true,
					},
					{
						name: 'Subject',
						value: `${channel.topic ? channel.topic : 'N/A'}`,
						inline: true,
					},
					{
						name: 'NSFW',
						value: `${channel.nsfw}`,
						inline: true,
					},
					{
						name: 'Parent',
						value: `${channel.parentId ? channel.parentId : 'N/A'}`,
						inline: true,
					},
				],
				type: 'reply',
			},
			ctx,
		);
	},
};
