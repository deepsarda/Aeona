import { CommandOptions, Context, requireGuildPermissions } from '@thereallonewolf/amethystframework';

import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'kick',
	description: 'Kick a user.',
	commandType: ['application', 'message'],
	category: 'moderation',
	args: [
		{
			name: 'user',
			description: 'The user to ban.',
			required: true,
			type: 'User',
		},
		{
			name: 'reason',
			description: 'The reason for the ban.',
			required: false,
			type: 'String',
		},
	],
	userGuildPermissions: ['KICK_MEMBERS'],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;

		const member = await client.helpers.getMember(ctx.guild!.id + '', (await ctx.options.getUser('user', true)).id);
		const reason = ctx.options.getLongString('reason') || 'Not given';
		try {
			requireGuildPermissions(client, ctx.guild, member, ['BAN_MEMBERS']);

			return client.extras.errNormal(
				{
					error: "You can't kick a moderator",
					type: 'reply',
				},
				ctx,
			);
		} catch {
			const channel = await client.helpers.getDmChannel(member.id);
			client.extras
				.embed(
					{
						title: `🔨 Kick`,
						desc: `You've been kicked in **${ctx.guild.name}**`,
						fields: [
							{
								name: '<:members:1063116392762712116> Kicked by',
								value: ctx.user.username + '#' + ctx.user.discriminator,
								inline: true,
							},
							{
								name: '💬 Reason',
								value: reason,
								inline: true,
							},
						],
					},
					channel,
				)
				.then(function () {
					client.helpers.kickMember(ctx.guild?.id + '', member.id + '', reason);

					client.extras.succNormal(
						{
							text: 'The specified user has been successfully kicked and successfully received a notification!',
							fields: [
								{
									name: '<:members:1063116392762712116> Kicked user',
									value: member.user?.username + '#' + member.user?.discriminator,
									inline: true,
								},
								{
									name: '💬 Reason',
									value: reason,
									inline: true,
								},
							],
							type: 'reply',
						},
						ctx,
					);
				})
				.catch(function () {
					client.helpers.kickMember(ctx.guild?.id + '', member.id + '', reason);

					client.extras.succNormal(
						{
							text: 'The given user has been successfully kicked, but has not received a notification!',
							type: 'reply',
						},
						ctx,
					);
				});
		}
	},
} as CommandOptions;
