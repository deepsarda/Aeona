import Schema from '../../database/models/messageRewards.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'deletereward',
	description: 'Delete a reward ',
	commandType: ['application', 'message'],
	category: 'messages',
	args: [
		{
			name: 'amount',
			description: 'The number of messages',
			required: true,
			type: 'Number',
		},
	],
	userGuildPermissions: ['MANAGE_MESSAGES'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const messages = ctx.options.getNumber('amount');

		Schema.findOne({ Guild: ctx.guildId, Messages: messages }, async (err: any, data: any) => {
			if (data) {
				Schema.findOneAndDelete({
					Guild: ctx.guildId,
					Messages: messages,
				}).then(() => {
					client.extras.succNormal(
						{
							text: `Message reward removed`,
							fields: [
								{
									name: '→ Messages',
									value: `${messages}`,
									inline: true,
								},
							],
							type: 'editreply',
						},
						ctx,
					);
				});
			} else {
				return client.extras.errNormal(
					{
						error: 'No message reward found at this message amount!',
						type: 'editreply',
					},
					ctx,
				);
			}
		});
	},
};
