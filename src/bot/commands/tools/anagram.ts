import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import fetch from 'node-fetch';

import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'anagram',
	description: 'Generate a anagram',
	commandType: ['application', 'message'],
	category: 'tools',
	args: [
		{
			name: 'word',
			description: 'the word to scramble',
			required: true,
			type: 'String',
		},
	],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const word = ctx.options.getLongString('word', true);

		fetch(`http://www.anagramica.com/all/${encodeURIComponent(word)}`)
			.then((res) => res.json())
			.catch()
			.then(async (json: any) => {
				let content = ``;
				if (!json.all[0]) return client.extras.errNormal({ error: 'No word found!', type: 'reply' }, ctx);

				json.all.forEach((i) => {
					content += `${i}\n`;
				});

				client.extras.embed(
					{
						title: `Anagram`,
						desc: `I formed a word with the given letters`,
						fields: [
							{
								name: `💬 Word(s)`,
								value: content,
							},
						],
						type: 'reply',
					},
					ctx,
				);
			})
			.catch();
	},
} as CommandOptions;
