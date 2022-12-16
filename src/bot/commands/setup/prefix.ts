import Functions from '../../database/models/functions';

import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'prefix',
	description: 'Change the prefix for your server.',
	commandType: ['application', 'message'],
	category: 'setup',
	args: [
		{
			name: 'prefix',
			description: 'The prefix to use.',
			required: true,
			type: 'String',
		},
	],
	userGuildPermissions: ['MANAGE_CHANNELS'],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		const prefix = ctx.options.getString('prefix', true);

		const guild = await Functions.findOne({ Guild: ctx.guild.id });
		if (!guild)
			new Functions({
				Guild: ctx.guild.id,
				Prefix: prefix,
			}).save();
		else {
			guild.Prefix = prefix;
			guild.save();
		}

		client.extras.succNormal(
			{
				text: `Succesfully set the prefix to: ${'`' + prefix + '`'}`,
				type: 'reply',
			},
			ctx,
		);
	},
} as CommandOptions;
