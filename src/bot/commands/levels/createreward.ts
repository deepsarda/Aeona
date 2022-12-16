import Schema from '../../database/models/levelRewards.js';

import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { AeonaBot } from '../../extras/index.js';
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
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		const level = ctx.options.getNumber('level', true);
		const role = await ctx.options.getRole('role', true);

		Schema.findOne({ Guild: ctx.guild!.id, Level: level }, async (err: any, data: any) => {
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
					Guild: ctx.guild!.id,
					Level: level,
					Role: role.id + '',
				}).save();

				client.extras.succNormal(
					{
						text: `Level reward created`,
						fields: [
							{
								name: '→ Role',
								value: `<@&${role.id}>`,
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
} as CommandOptions;
