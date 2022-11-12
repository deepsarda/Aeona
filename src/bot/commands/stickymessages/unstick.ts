import Schema from '../../database/models/stickymessages.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'stick',
	description: 'Generate a chat message',
	commandType: ['application', 'message'],
	category: 'stickymessages',
	args: [
		{
			name: 'channel',
			description: 'The channel to remove sticky messages from',
			type: 'Channel',
			required: true,
		},
	],
	userGuildPermissions: ['MANAGE_MESSAGES'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const channel = await ctx.options.getChannel('channel', true);

		Schema.findOne({ Guild: ctx.guildId, Channel: channel.id }, async (err, data) => {
			if (data) {
				Schema.findOneAndDelete({
					Guild: ctx.guildId,
					Channel: channel.id,
				}).then(() => {
					client.extras.succNormal(
						{
							text: 'Sticky message deleted',
							fields: [
								{
									name: `→ Channel`,
									value: `<#${channel.id}>`,
								},
							],
							type: 'editreply',
						},
						ctx,
					);
				});
			} else {
				client.extras.errNormal(
					{
						error: 'No message found!',
						type: 'editreply',
					},
					ctx,
				);
			}
		});
	},
};
