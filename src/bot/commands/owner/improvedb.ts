import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import functions from '../../database/models/functions.js';
import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'improvedb',
	description: 'Remove all the excess databases.',
	commandType: ['application', 'message'],
	category: 'owner',
	args: [
		{
			name: 'code',
			type: 'String',
			required: true,
		},
	],
	ownerOnly: true,
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		const guilds = await functions.find();
		let guildsToRemove = 0;
		for (let i = 0; i < guilds.length; i++) {
			if (
				guilds[i].isPremium == 'no' &&
				!guilds[i].Levels &&
				!guilds[i].AntiAlt &&
				!guilds[i].AntiCaps &&
				!guilds[i].AntiInvite &&
				!guilds[i].AntiLinks &&
				!guilds[i].AntiSpam &&
				(guilds[i].Prefix == '+' || guilds[i].Prefix == ',')
			) {
				guilds[i].delete();
				guildsToRemove++;
			}
		}

		ctx.reply({ content: 'Succesfully removed ' + guildsToRemove + ' guilds' });
	},
} as CommandOptions;
