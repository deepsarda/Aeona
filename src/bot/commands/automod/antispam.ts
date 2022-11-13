import Schema from '../../database/models/functions.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
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
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild+" "+ctx.channel+" "+ctx.user);
		const boolean = ctx.options.getBoolean('active', true);

		const data = await Schema.findOne({ Guild: ctx.guildId });
		if (data) {
			data.AntiSpam = boolean;
			data.save();
		} else {
			new Schema({
				Guild: ctx.guildId,
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
};
