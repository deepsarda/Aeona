import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import thanksSchema from '../../database/models/thanks.js';
import thanksAuthor from '../../database/models/thanksAuthor.js';
import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'thank',
	description: 'Thank a user.',
	commandType: ['application', 'message'],
	category: 'thanks',
	args: [
		{
			name: 'user',
			description: 'The user you want to thank.',
			type: 'User',
			required: true,
		},
	],
	aliases: ['thank'],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const target = await ctx.options.getUser('user');
		if (!target) return client.extras.errUsage({ usage: 'thanks [mention user]', type: 'reply' }, ctx);

		if (target.id === ctx.user.id)
			return client.extras.errNormal({ error: `You cannot thank yourself!`, type: 'reply' }, ctx);

		thanksAuthor.findOne({ User: target.id + '', Author: ctx.user.id + '' }, async (err, data) => {
			if (data) {
				client.extras.errNormal({ error: `You already thanked this user!`, type: 'reply' }, ctx);
			} else {
				thanksSchema.findOne({ User: target.id + '' }, async (err, data) => {
					if (data) {
						data.Received += 1;
						data.save();
						client.extras.succNormal(
							{
								text: `You have thanked <@${target.id}>! They now have \`${data.Received}\` thanks`,
								type: 'reply',
							},
							ctx,
						);
					} else {
						new thanksSchema({
							User: target.id + '',
							UserTag: target.username + '#' + target.discriminator,
							Received: 1,
						}).save();
						client.extras.succNormal(
							{
								text: `You have thanked <@${target.id}>! They now have \`1\` thanks`,
								type: 'reply',
							},
							ctx,
						);
					}
				});

				new thanksAuthor({
					User: target.id + '',
					Author: ctx.user?.id + '',
				}).save();
			}
		});
	},
} as CommandOptions;
