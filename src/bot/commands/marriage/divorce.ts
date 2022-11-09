import Schema from '../../database/models/family.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'divorce',
	description: 'Get a divorce from your spouse.',
	commandType: ['application', 'message'],
	category: 'marriage',
	args: [
		{
			name: 'user',
			description: 'The user you want to get a divorce from.',
			required: true,
			type: 'User',
		},
	],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const target = ctx.options.getUser('user', true);
		const author = ctx.user;

		if (author.id == target.id)
			return client.extras.errNormal(
				{
					error: 'You cannot divorce yourself',
					type: 'editreply',
				},
				ctx,
			);

		if (target.toggles.bot)
			return client.extras.errNormal(
				{
					error: 'You cannot divorce a bot',
					type: 'editreply',
				},
				ctx,
			);

		const data = await Schema.findOne({
			Guild: ctx.guildId,
			User: author.id,
			Partner: target.id,
		});
		if (data) {
			const data2 = await Schema.findOne({
				Guild: ctx.guildId,
				User: target.id,
			});
			if (data2) {
				data2.Partner = null;
				data2.save();
			}

			data.Partner = null;
			data.save();

			client.extras.embed(
				{
					title: `Divorced`,
					desc: `<@${author.id}> and <@${target.id}> have been divorced`,
					type: 'editreply',
				},
				ctx,
			);
		} else {
			client.extras.errNormal(
				{
					error: 'You are not married at the moment',
					type: 'editreply',
				},
				ctx,
			);
		}
	},
};
