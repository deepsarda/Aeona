import Schema from '../../database/models/family.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'disown',
	description: 'Disown a user.',
	commandType: ['application', 'message'],
	category: 'marriage',
	args: [
		{
			name: 'user',
			description: 'The user to disown.',
			required: true,
			type: 'User',
		},
	],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const target = await ctx.options.getUser('user', true);
		const author = ctx.user;
		const guild = { Guild: ctx.guildId };

		if (author.id == target.id)
			return client.extras.errNormal(
				{
					error: 'You cannot disown yourself',
					type: 'reply',
				},
				ctx,
			);

		if (target.toggles.bot)
			return client.extras.errNormal(
				{
					error: 'You cannot disown a bot',
					type: 'reply',
				},
				ctx,
			);

		Schema.findOne(
			{ Guild: ctx.guildId, Parent: target.id },
			async (err: any, data: { Parent: null; save: () => void }) => {
				if (data) {
					Schema.findOne({ Guild: ctx.guildId, User: data.Parent }, async (err: any, data2: any) => {
						if (data2) {
							client.extras.embed(
								{
									title: `Disowned`,
									desc: `<@${author.id}> has disowned <@!${data.Parent}>`,
									type: 'reply',
								},
								ctx,
							);

							data.Parent = null;
							data.save();
						}
					});
				} else {
					Schema.findOne({ Guild: ctx.guildId, User: author.id }, async (err: any, data: { Children: string[] }) => {
						if (data) {
							if (data.Children.includes(target.username)) {
								const filtered = data.Children.filter((user: string) => user !== target.username);

								await Schema.findOneAndUpdate(guild, {
									Guild: ctx.guildId,
									User: author.id + '',
									Children: filtered,
								});

								Schema.findOne(
									{ Guild: ctx.guildId, Parent: author.id },
									async (err: any, data: { Parent: null; save: () => void }) => {
										if (data) {
											data.Parent = null;
											data.save();
										}
									},
								);

								client.extras.embed(
									{
										title: `Disowned`,
										desc: `<@${author.id}> has disowned <@!${target.id}>`,
										type: 'reply',
									},
									ctx,
								);
							} else {
								client.extras.errNormal(
									{
										error: 'You have no children/parents at the moment',
										type: 'reply',
									},
									ctx,
								);
							}
						} else {
							client.extras.errNormal(
								{
									error: 'You have no children/parents at the moment',
									type: 'reply',
								},
								ctx,
							);
						}
					});
				}
			},
		);
	},
};
