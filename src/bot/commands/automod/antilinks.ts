import Schema from '../../database/models/functions.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'antilinks',
	description: 'Enable or disable links in your server',
	commandType: ['application', 'message'],
	category: 'automod',
	args: [
		{
			name: 'active',
			description: 'Enable or disable antiinvite for your server',
			type: 'Boolean',
			required: true,
		},
	],
	userGuildPermissions: ['MANAGE_GUILD'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const boolean = ctx.options.getBoolean('active', true);

		const data = await Schema.findOne({ Guild: ctx.guildId });
		if (data) {
			data.AntiLinks = boolean;
			data.save();
		} else {
			new Schema({
				Guild: ctx.guildId,
				AntiLinks: boolean,
			}).save();
		}

		client.extras.succNormal(
			{
				text: `Anti links is now **${boolean ? 'enabled' : 'disabled'}** in this guild`,
				type: 'editreply',
			},
			ctx,
		);
	},
};
