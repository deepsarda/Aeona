import Schema from '../../database/models/functions.js';

import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { AeonaBot } from '../../extras/index.js';
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
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		const boolean = ctx.options.getBoolean('active', true);

		const data = await Schema.findOne({ Guild: ctx.guild!.id });
		if (data) {
			data.AntiLinks = boolean;
			data.save();
		} else {
			new Schema({
				Guild: ctx.guild!.id,
				AntiLinks: boolean,
			}).save();
		}

		client.extras.succNormal(
			{
				text: `Anti links is now **${boolean ? 'enabled' : 'disabled'}** in this guild`,
				type: 'reply',
			},
			ctx,
		);
	},
} as CommandOptions;
