import Schema from '../../database/models/warnings.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'unwarn',
	description: 'Remove warning from a user.',
	commandType: ['application', 'message'],
	category: 'moderation',
	args: [
		{
			name: 'user',
			description: 'The user.',
			required: true,
			type: 'User',
		},
	],
	userGuildPermissions: ['MANAGE_MESSAGES'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild+" "+ctx.channel+" "+ctx.user);

		const member = await ctx.options.getUser('user', true);

		Schema.findOne(
			{ Guild: ctx.guildId, User: member.id },
			async (err: any, data: { Warns: number; save: () => void }) => {
				if (data) {
					data.Warns -= 1;
					data.save();
				} else {
					client.extras.errNormal(
						{
							error: 'User has no warnings!',
							type: 'reply',
						},
						ctx,
					);
				}
			},
		);

		client.extras
			.embed(
				{
					title: `🔨 Unwarn`,
					desc: `You've been unwarned in **${ctx.guild.name}**`,
					fields: [
						{
							name: '→ Moderator',
							value: ctx.user.username + '#' + ctx.user.discriminator,
							inline: true,
						},
					],
				},
				member,
			)
			.catch();

		client.emit('warnRemove', member, ctx.user);
		client.extras.succNormal(
			{
				text: `The user's warning has been successfully removed`,
				fields: [
					{
						name: '→ User',
						value: `${member}`,
						inline: true,
					},
				],
				type: 'reply',
			},
			ctx,
		);
	},
};
