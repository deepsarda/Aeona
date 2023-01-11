import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import Schema from '../../database/models/birthday.js';
import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'check',
	description: 'See if your birthday is there.',
	commandType: ['application', 'message'],
	category: 'birthdays',
	args: [],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		Schema.findOne({ Guild: ctx.guild!.id, User: ctx.user.id }, async (err, data) => {
			if (!data)
				return client.extras.errNormal(
					{
						error: 'No birthday found!',
						type: 'reply',
					},
					ctx,
				);

			client.extras.embed(
				{
					title: `${client.extras.emotes.normal.birthday} Birthday check`,
					desc: `${ctx.user?.username} birthday is on ${data.Birthday}`,
					type: 'reply',
				},
				ctx,
			);
		});
	},
} as CommandOptions;
