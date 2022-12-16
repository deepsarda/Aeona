import request from 'request';

import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { AeonaBot } from '../../extras/index.js';
export default {
	name: 'fact',
	description: 'Get a fun fact',
	commandType: ['application', 'message'],
	category: 'fun',
	args: [],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);

		const url = 'https://uselessfacts.jsph.pl/random.json?language=en';
		request(url, function (err, response, body) {
			const fact = JSON.parse(body).text;

			client.extras.embed(
				{
					title: `Fact`,
					desc: fact,
					type: 'reply',
				},
				ctx,
			);
		});
	},
} as CommandOptions;
