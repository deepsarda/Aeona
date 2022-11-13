import Schema from '../../database/models/birthday.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'list',
	description: 'See all the birthdays',
	commandType: ['application', 'message'],
	category: 'birthdays',
	args: [],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild+" "+ctx.channel+" "+ctx.user);
		const rawBirthdayboard = await Schema.find({ Guild: ctx.guildId });

		if (rawBirthdayboard.length < 1)
			return client.extras.errNormal(
				{
					error: 'No birthdays found!',
					type: 'reply',
				},
				ctx,
			);

		const lb = rawBirthdayboard.map(
			(e) => `${client.extras.emotes.normal.birthday} | **<@!${e.User}>** → ${e.Birthday} `,
		);

		await client.extras.createLeaderboard(`🎂 Birthdays - ${ctx.guild.name}`, lb, ctx);
	},
};
