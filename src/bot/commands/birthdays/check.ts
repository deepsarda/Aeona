import Schema from '../../database/models/birthday.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'check',
	description: 'See if your birthday is there.',
	commandType: ['application', 'message'],
	category: 'birthdays',
	args: [],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		Schema.findOne({ Guild: ctx.guildId, User: ctx.user.id }, async (err, data) => {
			if (!data)
				return client.extras.errNormal(
					{
						error: 'No birthday found!',
						type: 'editreply',
					},
					ctx,
				);

			client.extras.embed(
				{
					title: `${client.extras.emotes.normal.birthday} Birthday check`,
					desc: `${ctx.user?.username} birthday is on ${data.Birthday}`,
					type: 'editreply',
				},
				ctx,
			);
		});
	},
};
