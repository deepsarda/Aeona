import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import Schema from '../../database/models/reviewChannels.js';
import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'review',
	description: 'Wrute a review',
	commandType: ['application', 'message'],
	category: 'tools',
	args: [
		{
			name: 'stars',
			description: 'The number of stars to rate.',
			required: true,
			type: 'String',
		},
		{
			name: 'temessagext',
			description: 'the message.',
			required: true,
			type: 'String',
		},
	],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const stars = ctx.options.getNumber('stars', true);
		const message = ctx.options.getString('message') || 'Not given';

		if (stars < 1 || stars > 5)
			return client.extras.errNormal(
				{
					error: `Stars must be a minimum of 1 and a maximum of 5`,
					type: 'reply',
				},
				ctx,
			);

		Schema.findOne({ Guild: ctx.guild!.id }, async (err, data) => {
			if (data) {
				const channel = await client.cache.channels.get(data.Channel);
				if (!channel)
					return client.extras.errNormal(
						{
							error: `No review channel set! Do \`reviewchannel\``,
							type: 'reply',
						},
						ctx,
					);

				let totalStars = '';
				for (let i = 0; i < stars; i++) {
					totalStars += ':star:';
				}

				client.extras.succNormal(
					{
						text: 'Your review has been successfully submitted',
						fields: [
							{
								name: `→ Stars`,
								value: `${stars}`,
								inline: true,
							},
							{
								name: `→ Channel`,
								value: `<#${data.Channel}>`,
								inline: true,
							},
						],
						type: 'reply',
					},
					ctx,
				);

				client.extras.embed(
					{
						title: `Review ${ctx.user?.username + '#' + ctx.user?.discriminator}`,
						desc: `A new review has been written!`,
						fields: [
							{
								name: 'Stars',
								value: `${totalStars}`,
								inline: true,
							},
							{
								name: 'Note',
								value: `${message}`,
								inline: true,
							},
						],
					},
					channel,
				);
			} else {
				client.extras.errNormal(
					{
						error: `No review channel set! Do \`reviewchannel\``,
						type: 'reply',
					},
					ctx,
				);
			}
		});
	},
} as CommandOptions;
