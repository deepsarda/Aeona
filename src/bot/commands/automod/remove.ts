import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import blacklistedWords from '../../Collection/index.js';
import Schema from '../../database/models/blacklist.js';
import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'remove',
	description: 'Remove a blacklisted word',
	commandType: ['application', 'message'],
	category: 'automod',
	args: [
		{
			name: 'word',
			description: 'The word to remove from the blacklist. Example: Bruh',
			required: true,
			type: 'String',
		},
	],
	userGuildPermissions: ['MANAGE_GUILD'],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const word = ctx.options.getString('word', true);

		Schema.findOne({ Guild: ctx.guild!.id }, async (err: any, data: { Words: string[] }) => {
			if (!ctx.guild || !ctx.user || !ctx.channel) return;

			if (data) {
				if (!data.Words.includes(word)) {
					return client.extras.errNormal(
						{
							error: `That word doesn't exist in the database!`,
							type: 'reply',
						},
						ctx,
					);
				}

				const filtered = data.Words.filter((target: string) => target !== word);

				await Schema.findOneAndUpdate(
					{ Guild: ctx.guild!.id },
					{
						Guild: ctx.guild!.id,
						Words: filtered,
					},
				);

				blacklistedWords.set(ctx.guild!.id!, filtered);

				client.extras.succNormal(
					{
						text: `Word is removed from the blacklist!`,
						fields: [
							{
								name: `💬 Word`,
								value: `${word}`,
							},
						],
						type: 'reply',
					},
					ctx,
				);
			} else {
				client.extras.errNormal(
					{
						error: `This guild has not data!`,
						type: 'reply',
					},
					ctx,
				);
			}
		});
	},
} as CommandOptions;
