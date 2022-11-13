import Schema from '../../database/models/warnings.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'warn',
	description: 'Warn a user.',
	commandType: ['application', 'message'],
	category: 'moderation',
	args: [
		{
			name: 'user',
			description: 'The user to warn.',
			required: true,
			type: 'User',
		},
	],
	userGuildPermissions: ['MANAGE_MESSAGES'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);

		const member = await ctx.options.getUser('user', true);

		Schema.findOne(
			{ Guild: ctx.guildId, User: member.id },
			async (err: any, data: { Warns: number; save: () => void }) => {
				if (data) {
					data.Warns += 1;
					data.save();
				} else {
					new Schema({
						Guild: ctx.guildId,
						User: member.id + '',
						Warns: 1,
					}).save();
				}
			},
		);

		client.extras
			.embed(
				{
					title: `🔨 Warn`,
					desc: `You've been warned in **${ctx.guild.name}**`,
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

		client.emit('warnAdd', member, ctx.user);
		client.extras.succNormal(
			{
				text: `User has received a warning!`,
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
