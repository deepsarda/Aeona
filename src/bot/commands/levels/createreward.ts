import Schema from '../../database/models/levelRewards.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'createreward',
	description: 'Create a reward for reaching a role.',
	commandType: ['application', 'message'],
	category: 'levels',
	args: [
		{
			name: 'level',
			description: 'The level you want to create a reward for.',
			required: true,
			type: 'Number',
		},
		{
			name: 'role',
			description: 'The role you want to create a reward for.',
			required: true,
			type: 'Role',
		},
	],
	userGuildPermissions: ['MANAGE_MESSAGES'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const level = ctx.options.getNumber('level', true);
		const role = await ctx.options.getRole('role', true);

		Schema.findOne({ Guild: ctx.guildId, Level: level }, async (err: any, data: any) => {
			if (data) {
				return client.extras.errNormal(
					{
						error: 'This level already has a reward!',
						type: 'reply',
					},
					ctx,
				);
			} else {
				new Schema({
					Guild: ctx.guildId,
					Level: level,
					Role: role.id + '',
				}).save();

				client.extras.succNormal(
					{
						text: `Level reward created`,
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
