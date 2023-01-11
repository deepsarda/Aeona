import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { ChannelTypes } from 'discordeno/types';

import Schema from '../../database/models/stats.js';
import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'animated-emoji',
	description: 'Create a stats channel for animated emojies.',
	commandType: ['application', 'message'],
	category: 'serverstats',
	args: [],
	userGuildPermissions: ['MANAGE_CHANNELS'],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		let Animated = 0;
		const emojies = await client.helpers.getEmojis(ctx.guild!.id);
		emojies.forEach((emoji) => {
			if (emoji.toggles.animated) {
				Animated++;
			}
		});

		let channelName = await client.extras.getTemplate(ctx.guild!.id);
		channelName = channelName.replace(`{emoji}`, '🤡');
		channelName = channelName.replace(`{name}`, `Animated Emojis: ${Animated || '0'}`);

		client.helpers
			.createChannel(ctx.guild!.id, {
				name: channelName,
				type: ChannelTypes.GuildVoice,
				permissionOverwrites: [
					{
						deny: ['CONNECT'],
						type: 0,
						id: ctx.guild!.id,
					},
				],
			})
			.then(async (channel) => {
				Schema.findOne({ Guild: ctx.guild!.id }, async (err, data) => {
					if (data) {
						data.AnimatedEmojis = channel.id;
						data.save();
					} else {
						new Schema({
							Guild: ctx.guild!.id,
							AnimatedEmojis: channel.id,
						}).save();
					}
				});

				client.extras.succNormal(
					{
						text: `Animated emoji's count created!`,
						fields: [
							{
								name: `→ Channel`,
								value: `<#${channel.id}>`,
							},
						],
						type: 'reply',
					},
					ctx,
				);
			});
	},
} as CommandOptions;
