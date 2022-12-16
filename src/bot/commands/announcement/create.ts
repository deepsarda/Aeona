import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { AeonaBot } from '../../extras/index.js';
export default {
	name: 'create',
	description: 'Create an announcement',
	commandType: ['application', 'message'],
	category: 'announcement',
	args: [
		{
			name: 'message',
			description: 'Announcement Text. Example: New Update.',
			type: 'String',
			required: true,
		},
		{
			name: 'channel',
			description: 'Channel to send the announcement to.',
			type: 'Channel',
			required: true,
		},
	],
	userGuildPermissions: ['MANAGE_GUILD'],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		const message = ctx.options.getString('message', true);
		const channel = await ctx.options.getChannel('channel', true);

		client.extras.embed(
			{
				title: `📢 Announcement!`,
				desc: message,
			},
			channel,
		);

		client.extras.succNormal(
			{
				text: `Announcement has been sent successfully!`,
				fields: [
					{
						name: `→ Channel`,
						value: `${channel} (${channel?.name})`,
					},
				],
				type: 'reply',
			},
			ctx,
		);
	},
} as CommandOptions;
