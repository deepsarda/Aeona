import welcomeRole from '../../database/models/joinRole.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'welcomerole',
	description: 'Role to give to the members who join.',
	commandType: ['application', 'message'],
	category: 'setup',
	args: [{
		name:'role',
		description: 'Role to give to the members who join.',
		required: true,
		type:'Role'
	}],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const role = await ctx.options.getRole('role',true);

		client.extras.createRoleSetup(welcomeRole, role, ctx);
	},
};
