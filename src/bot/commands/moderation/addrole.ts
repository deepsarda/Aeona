import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'addrole',
	description: 'Add role to a user.',
	commandType: ['application', 'message'],
	category: 'moderation',
	args: [
		{
			name: 'user',
			description: 'The user to give role too.',
			required: true,
			type: 'User',
		},
		{
			name: 'role',
			description: 'The role to be given to the user',
			required: false,
			type: 'Role',
		},
		{
			name: 'reason',
			description: 'The reason to give the role.',
			required: false,
			type: 'String',
		},
	],
	userGuildPermissions: ['MODERATE_MEMBERS'],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const user = await ctx.options.getUser('user', true);

		const role = await ctx.options.getRole('role', true);
		const reason = ctx.options.getLongString('reason') || `Not given`;

		client.helpers
			.addRole(ctx.guild.id, user.id, role.id, reason)
			.then(() =>
				client.extras.succNormal(
					{
						text: `I have successfully added the role to that user.`,
					},
					ctx,
				),
			)
			.catch(() =>
				client.extras.errNormal(
					{
						error: `I was unable to add the role to that user. Please check that the user does not already have that role and I have premissions to give it to them.`,
					},
					ctx,
				),
			);
	},
} as CommandOptions;
