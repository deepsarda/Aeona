import Schema from '../../database/models/levelRewards.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
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
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		const level = ctx.options.getNumber('level', true);

		Schema.findOne({ Guild: ctx.guildId, Level: level }, async (err: any, data: any) => {
			if (data) {
				Schema.findOneAndDelete({
					Guild: ctx.guildId,
					Level: level,
				}).then(() => {
					client.extras.succNormal(
						{
							text: `Level reward removed`,
							fields: [
								{
									name: '→ Level',
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
};
