import welcomeRole from '../../database/models/joinRole.js';
import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'welcomerole',
	description: 'Setup the welcome role',
	commandType: ['application', 'message'],
	category: 'autosetup',
	args: [],
	userGuildPermissions: ['MANAGE_GUILD'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);

		const role = await client.helpers.createRole(ctx.guildId!, {
			name: 'Member',
			//@ts-ignore
			color: client.extras.config.colors.normal,
		});

		client.extras.createRoleSetup(welcomeRole, role, ctx);
	},
};
