import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
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
		},
	],
	userGuildPermissions: ['MANAGE_MESSAGES'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;

		const amount = ctx.options.getNumber('amount', true);

		if (amount > 100)
			return client.extras.errNormal(
				{
					error: 'I cannot delete more than 100 messages at a time!',
					type: 'editreply',
				},
				ctx,
			);

		if (amount < 1)
			return client.extras.errNormal(
				{
					error: 'I cannot delete less than 1 message!',
					type: 'editreply',
				},
				ctx,
			);
		const messageIds = (
			await client.helpers.getMessages(ctx.channel.id, {
				limit: amount + 1,
			})
		).map((msg) => msg.id);
		client.helpers
			.deleteMessages(ctx.channel.id, messageIds)
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
						type: 'ephemeraledit',
					},
					ctx,
				);
			})
			.catch((err) => {
				client.extras.errNormal(
					{
						error: 'There was an error trying to delete messages in this channel!',
						type: 'editreply',
					},
					ctx,
				);
			});
	},
};
