import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import Schema from '../../database/models/functions.js';
import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'antispam',
	description: 'Enable or disable antispam on your server',
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
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const boolean = ctx.options.getBoolean('active', true);

		const data = await Schema.findOne({ Guild: ctx.guild!.id });
		if (data) {
			data.AntiSpam = boolean;
			data.save();
		} else {
			new Schema({
				Guild: ctx.guild!.id,
				AntiSpam: boolean,
			}).save();
		}

		client.extras.succNormal(
			{
				text: `Anti spam is now **${boolean ? 'enabled' : 'disabled'}** in this guild`,
				type: 'reply',
			},
			ctx,
		);
	},
} as CommandOptions;
