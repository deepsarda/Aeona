import welcomeRole from '../../database/models/joinRole.js';
import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { AeonaBot } from '../../extras/index.js';
export default {
	name: 'welcomerole',
	description: 'Setup the welcome role',
	commandType: ['application', 'message'],
	category: 'autosetup',
	args: [],
	userGuildPermissions: ['MANAGE_GUILD'],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);

		const role = await client.helpers.createRole(ctx.guild!.id!, {
			name: 'Member',
			//@ts-ignore
			color: client.extras.config.colors.normal,
		});

		client.extras.createRoleSetup(welcomeRole, role, ctx);
	},
} as CommandOptions;
