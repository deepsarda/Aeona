import Schema from '../../database/models/messageRewards.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'createreward',
	description: 'Create a reward for a user reaching a certain amount of messages.',
	commandType: ['application', 'message'],
	category: 'messages',
	args: [
		{
			name: 'amount',
			description: 'How many messages ',
			required: true,
			type: 'Number',
		},
		{
			name: 'role',
			description: 'The role',
			required: true,
			type: 'Role',
		},
	],
	userGuildPermissions: ['MANAGE_MESSAGES'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const messages = ctx.options.getNumber('amount', true);
		const role = await ctx.options.getRole('role', true);

		Schema.findOne({ Guild: ctx.guildId, Messages: messages }, async (err: any, data: any) => {
			if (data) {
				return client.extras.errNormal(
					{
						error: 'This message amount already has a reward!',
						type: 'reply',
					},
					ctx,
				);
			} else {
				new Schema({
					Guild: ctx.guildId,
					Messages: messages,
					Role: role.id + '',
				}).save();

				client.extras.succNormal(
					{
						text: `Message reward created`,
						fields: [
							{
								name: '→ Role',
								value: `<&${role.id}>`,
								inline: true,
							},
						],
						type: 'reply',
					},
					ctx,
				);
			}
		});
	},
};
