import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import axios from 'axios';

import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'crypto',
	description: 'See the latest crypto information',
	commandType: ['application', 'message'],
	category: 'tools',
	args: [
		{
			name: 'coin',
			description: 'The crypto coin',
			required: true,
			type: 'String',
		},
		{
			name: 'text',
			description: 'the sentence to use',
			required: true,
			type: 'String',
		},
	],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const coin = ctx.options.getString('coin', true);
		const currency = ctx.options.getString('currency', true);

		try {
			const { data } = await axios.get(
				`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=${currency}`,
			);

			if (!data[coin][currency]) return;

			client.extras.embed(
				{
					title: `💹 Crypto stats`,
					desc: `The current price of **1 ${coin}** = **${data[coin][currency]} ${currency}**`,
					type: 'reply',
				},
				ctx,
			);
		} catch {
			client.extras.errNormal(
				{
					error: 'Please check your inputs!',
					type: 'reply',
				},
				ctx,
			);
		}
	},
} as CommandOptions;
