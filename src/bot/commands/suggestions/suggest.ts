import Schema from '../../database/models/suggestionChannels.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'suggest',
	description: 'Generate a chat message',
	commandType: ['application', 'message'],
	category: 'suggestions',
	args: [
		{
			name: 'suggestion',
			type: 'String',
			description: 'The suggestion you want to suggest',
			required: true,
		},
	],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		const suggestionQuery = await ctx.options.getString('suggestion', true);

		const data = await Schema.findOne({ Guild: ctx.guildId });
		if (data) {
			const channel = await client.cache.channels.get(BigInt(data.Channel));

			client.extras
				.embed(
					{
						title: `💡 Suggestion`,
						desc: `${suggestionQuery}`,
						author: {
							name: ctx.user.username + '#' + ctx.user.discriminator + '(' + ctx.user.id + ')',
							iconURL: client.helpers.getAvatarURL(ctx.user.id + '', ctx.user.discriminator, {
								avatar: ctx.user.avatar,
							}),
						},
					},
					channel,
				)
				.then((msg) => {
					client.extras.succNormal(
						{
							text: `Suggestion successfully submitted!`,
							fields: [
								{
									name: `→ Suggestion`,
									value: `${suggestionQuery}`,
									inline: true,
								},
								{
									name: `→ Channel`,
									value: `<#${data.Channel}>`,
									inline: true,
								},
							],
							type: 'editreply',
						},
						ctx,
					);

					msg.react('🔺');
					msg.react('🔻');
				})
				.catch((e) => {
					return client.extras.errNormal(
						{
							error: `No suggestion channel set! Please do the setup`,
							type: 'editreply',
						},
						ctx,
					);
				});
		} else {
			client.extras.errNormal(
				{
					error: `No suggestion channel set! Please do the setup`,
					type: 'editreply',
				},
				ctx,
			);
		}
	},
};
