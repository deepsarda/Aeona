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
		const guildsToRemove: typeof guilds = [];
		for (let i = 0; i < guilds.length; i++) {
			if (!client.cache.guilds.memory.has(BigInt(guilds[i].Guild!))) {
				guildsToRemove.push(guilds[i]);
			}
		}

		ctx.reply({ content: "Removing " + guildsToRemove.length + " guilds" })
		for (let i = 0; i < guildsToRemove.length; i++) {
			guildsToRemove[i].delete();
		}
		ctx.reply({ content: "Succesfully removed " + guildsToRemove.length + " guilds" })
	},
} as CommandOptions;
