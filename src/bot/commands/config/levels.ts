import Schema from '../../database/models/functions.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'levels',
	description: 'Enable or disable level messages',
	commandType: ['application', 'message'],
	category: 'config',
	args: [
		{
			name: 'boolean',
			description: 'Enable or disable level messages',
			required: true,
			type: 'Boolean',
		},
	],
	userGuildPermissions: ['MANAGE_GUILD'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;

		const boolean = ctx.options.getBoolean('boolean', true);

		const data = await Schema.findOne({ Guild: ctx.guildId });
		if (data) {
			data.Levels = boolean;
			data.save();
		} else {
			new Schema({
				Guild: ctx.guildId,
				Levels: boolean,
			}).save();
		}

		client.extras.succNormal(
			{
				text: `Levels is now **${boolean ? 'enabled' : 'disabled'}** in this guild`,
				type: 'reply',
			},
			ctx,
		);
	},
};
