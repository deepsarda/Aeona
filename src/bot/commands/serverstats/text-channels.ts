import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { ChannelTypes } from 'discordeno/types';

import Schema from '../../database/models/stats.js';
import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'text-channels',
	description: 'Create a stats channel for the number of text channels',
	commandType: ['application', 'message'],
	category: 'serverstats',
	args: [],
	userGuildPermissions: ['MANAGE_CHANNELS'],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		let channelName = await client.extras.getTemplate(ctx.guild!.id);
		channelName = channelName.replace(`{emoji}`, '💬');
		channelName = channelName.replace(
			`{name}`,
			`Text Channels: ${(await client.helpers.getChannels(ctx.guild!.id)).filter((ch) => ch.type == ChannelTypes.GuildText).size || 0
			}`,
		);

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
						data.TextChannels = channel.id;
						data.save();
					} else {
						new Schema({
							Guild: ctx.guild!.id,
							TextChannels: channel.id,
						}).save();
					}
				});

				client.extras.succNormal(
					{
						text: `Text channel count created!`,
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
