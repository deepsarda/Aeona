import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import Schema from '../../database/models/levelRewards.js';
import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'deletereward',
	description: 'Delete a level reward',
	commandType: ['application', 'message'],
	category: 'levels',
	args: [
		{
			name: 'level',
			description: 'The level you want to delete',
			required: true,
			type: 'Number',
		},
	],
	userGuildPermissions: ['MANAGE_MESSAGES'],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const level = ctx.options.getNumber('level', true);

		Schema.findOne({ Guild: ctx.guild!.id, Level: level }, async (err: any, data: any) => {
			if (data) {
				Schema.findOneAndDelete({
					Guild: ctx.guild!.id,
					Level: level,
				}).then(() => {
					client.extras.succNormal(
						{
							text: `Level reward removed`,
							fields: [
								{
									name: '📈 Level',
									value: `${level}`,
									inline: true,
								},
							],
							type: 'reply',
						},
						ctx,
					);
				});
			} else {
				return client.extras.errNormal(
					{
						error: 'No level reward found at this level!',
						type: 'reply',
					},
					ctx,
				);
			}
		});
	},
} as CommandOptions;
