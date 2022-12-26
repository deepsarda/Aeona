/* Importing the blacklisted words from the Collection.ts file and the database model. */
import blacklistedWords from '../../Collection/index.js';
import Schema from '../../database/models/blacklist.js';

import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { AeonaBot } from '../../extras/index.js';
export default {
	name: 'add',
	description: 'Add a blacklisted word',
	commandType: ['application', 'message'],
	category: 'automod',
	args: [
		{
			name: 'word',
			description: 'Word to blacklist. Example: Bruh',
			type: 'String',
			required: true,
		},
	],
	userGuildPermissions: ['MANAGE_GUILD'],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel || !ctx.guild) return;
		const word = ctx.options.getString('word', true);
		if (!word) return;

		Schema.findOne({ Guild: ctx.guild!.id }, async (err: any, data: { Words: string[]; save: () => void }) => {
			if (!ctx.guild || !ctx.user || !ctx.channel || !ctx.guild) return;

			if (data) {
				if (data.Words.includes(word)) {
					return client.extras.errNormal(
						{
							error: `That word is already exists in the database!`,
							type: 'reply',
						},
						ctx,
					);
				}
				data.Words.push(word);
				data.save();
				blacklistedWords.get(ctx.guild!.id!)?.push(word);
			} else {
				new Schema({
					Guild: ctx.guild!.id,
					Words: word,
				}).save();

				blacklistedWords.set(ctx.guild!.id!, [word]);
			}
		});

		client.extras.succNormal(
			{
				text: `Word is now blacklisted!`,
				fields: [
					{
						name: `→ Word`,
						value: `${word}`,
					},
				],
			},
			ctx,
		);
	},
} as CommandOptions;
