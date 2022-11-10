import fetch from 'node-fetch';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'birdfact',
	description: 'Get a random fun bird fact',
	commandType: ['application', 'message'],
	category: 'fun',
	args: [],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		fetch(`https://some-random-api.ml/facts/bird`)
			.then((res) => res.json())
			.catch()
			.then(async (json: any) => {
				client.extras.embed(
					{
						title: `Random bird fact`,
						desc: json.fact,
						type: 'reply',
					},
					ctx,
				);
			})
			.catch();
	},
};
