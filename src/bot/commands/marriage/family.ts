import Schema from '../../database/models/family.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'family',
	description: 'See your family',
	commandType: ['application', 'message'],
	category: 'marriage',
	args: [
		{
			name: 'user',
			description: 'Name of the user',
			required: false,
			type: 'User',
		},
	],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const target = ctx.options.getUser('user') || ctx.user;

		const data = await Schema.findOne({
			Guild: ctx.guildId,
			User: target.id,
		});

		client.extras.embed(
			{
				title: `${target.username}'s Family`,
				thumbnail: client.helpers.getAvatarURL(target.id, target.discriminator, {
					avatar: target.avatar,
				}),
				fields: [
					{
						name: `Partner`,
						value: `${data && data.Partner ? `<@!${data.Partner}>` : `This user is not married`}`,
					},
					{
						name: `Parent`,
						value: `${data && data.Parent.length > 0 ? `${data.Parent.join(', ')}` : `This user has no parents`}`,
					},
					{
						name: `Children`,
						value: `${data && data.Children.length > 0 ? `${data.Children.join(', ')}` : `This user has no children`}`,
					},
				],
				type: 'editreply',
			},
			ctx,
		);
	},
};
