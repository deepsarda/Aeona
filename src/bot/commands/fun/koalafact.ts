import fetch from 'node-fetch';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'koalafact',
	description: 'Get a fun kola fact',
	commandType: ['application', 'message'],
	category: 'fun',
	args: [],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		fetch(`https://some-random-api.ml/facts/koala`)
			.then((res) => res.json())
			.catch()
			.then(async (json: any) => {
				client.extras.embed(
					{
						title: `Random koala fact`,
						desc: json.fact,
						type: 'reply',
					},
					ctx,
				);
			})
			.catch();
	},
};
