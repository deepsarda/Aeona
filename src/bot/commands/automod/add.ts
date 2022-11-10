/* Importing the blacklisted words from the Collection.ts file and the database model. */
import blacklistedWords from '../../Collection/index.js';
import Schema from '../../database/models/blacklist.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
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
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel || !ctx.guild) return;
		const word = ctx.options.getString('word', true);
		if (!word) return;

		Schema.findOne({ Guild: ctx.guildId }, async (err: any, data: { Words: string[]; save: () => void }) => {
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
				blacklistedWords.get(ctx.guildId!)?.push(word);
			} else {
				new Schema({
					Guild: ctx.guildId,
					Words: word,
				}).save();

				blacklistedWords.set(ctx.guildId!, [word]);
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
				type: 'reply',
			},
			ctx,
		);
	},
};
