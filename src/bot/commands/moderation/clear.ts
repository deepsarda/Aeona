import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'clear',
	description: 'Clear messages in a channel',
	commandType: ['application', 'message'],
	category: 'moderation',
	aliases: ['purge'],
	args: [
		{
			name: 'amount',
			description: 'The amount of messages to delete',
			required: true,
			type: 'Number',
		},
	],
	userGuildPermissions: ['MANAGE_MESSAGES'],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;

		const amount = ctx.options.getNumber('amount', true);

		if (amount > 99)
			return client.extras.errNormal(
				{
					error: 'I cannot delete more than 100 messages at a time!',
					type: 'reply',
				},
				ctx,
			);

		if (amount < 1)
			return client.extras.errNormal(
				{
					error: 'I cannot delete less than 1 message!',
					type: 'reply',
				},
				ctx,
			);
		const messageIds = (
			await client.helpers.getMessages(ctx.channel.id + '', {
				limit: amount + 1,
			})
		).map((msg) => msg.id);

		client.helpers
			.deleteMessages(ctx.channel.id + '', messageIds)
			.then(() => {
				client.extras.succNormal(
					{
						text: `I have successfully deleted the messages`,
						fields: [
							{
								name: '→ Amount',
								value: `${amount}`,
								inline: true,
							},
						],
						type: 'ephemeral',
					},
					ctx,
				);
			})
			.catch((_err) => {
				client.extras.errNormal(
					{
						error: 'There was an error trying to delete messages in this channel!',
						type: 'reply',
					},
					ctx,
				);
			});
	},
} as CommandOptions;
