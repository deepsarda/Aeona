import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { AeonaBot } from '../../extras/index.js';
export default {
	name: 'demote',
	description: 'Demote a user.',
	commandType: ['application', 'message'],
	category: 'moderation',
	args: [
		{
			name: 'user',
			description: 'The user to demote.',
			required: true,
			type: 'User',
		},
	],
	userGuildPermissions: ['MANAGE_GUILD'],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);

		const member = await client.helpers.getMember(ctx.guild!.id + '', (await ctx.options.getUser('user', true)).id);

		await client.helpers
			.removeRole(ctx.guild!.id + '', member.id + '', member.roles[member.roles.length - 1])
			.then((r) => {
				client.extras
					.embed(
						{
							title: `Demote`,
							desc: `You've been demoted from **${ctx.guild?.name}**`,
							fields: [
								{
									name: '→ Moderator',
									value: ctx.user?.username + '#' + ctx.user?.discriminator,
									inline: true,
								},
							],
						},
						member,
					)
					.catch();

				client.extras.succNormal(
					{
						text: `User successfully demoted`,
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
			})
			.catch(() => {
				client.extras.errNormal(
					{
						error: "I can't demote the user",
						type: 'reply',
					},
					ctx,
				);
			});
	},
} as CommandOptions;
