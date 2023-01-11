import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import welcomeRole from '../../database/models/joinRole.js';
import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'welcomerole',
	description: 'Role to give to the members who join.',
	commandType: ['application', 'message'],
	category: 'setup',
	args: [
		{
			name: 'role',
			description: 'Role to give to the members who join.',
			required: true,
			type: 'Role',
		},
	],
	userGuildPermissions: ['MANAGE_CHANNELS'],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const role = await ctx.options.getRole('role', true);

		client.extras.createRoleSetup(welcomeRole, role, ctx);
	},
} as CommandOptions;
