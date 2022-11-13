import Canvacord from 'canvacord';

import Functions from '../../database/models/functions.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
import { Blob } from 'buffer';

export default {
	name: 'rank',
	description: 'See your rank.',
	commandType: ['application', 'message'],
	category: 'levels',
	args: [
		{
			name: 'user',
			description: 'The user you want to see the rank of.',
			required: false,
			type: 'User',
		},
	],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild+" "+ctx.channel+" "+ctx.user);
		const data = await Functions.findOne({ Guild: ctx.guildId });

		if (data && data.Levels == true) {
			const target = (await ctx.options.getUser('user')) || ctx.user;
			const user = await client.extras.fetchLevels(target.id + '', ctx.guildId);

			const xpRequired = client.extras.xpFor(user.level + 1);

			const rankCard = new Canvacord.Rank()
				.setAvatar(
					client.helpers.getAvatarURL(target.id + '', target.discriminator, {
						avatar: target.avatar,
						format: 'png',
					}),
				)
				.setRequiredXP(xpRequired)
				.setCurrentXP(user.xp)
				.setLevel(user.level)
				.setProgressBar(client.extras.config.colors.normal, 'COLOR')
				.setUsername(target.username)
				.setDiscriminator(target.discriminator)
				.setStatus('dnd', true)
				.setRank(user.position);

			rankCard.build({}).then((data) => {
				ctx.editReply({
					files: [
						{
							name: 'image.png',
							blob: new Blob([data], {
								type: 'image/png',
							}),
						},
					],
				});
			});
		} else {
			client.extras.errNormal(
				{
					error: 'Levels are disabled in this guild!',
					type: 'reply',
				},
				ctx,
			);
		}
	},
};
