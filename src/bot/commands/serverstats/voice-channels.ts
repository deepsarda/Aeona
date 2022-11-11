import Schema from '../../database/models/stats.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
import { ChannelTypes } from 'discordeno/types';
export default {
	name: 'voice-channels',
	description: 'Create a stats channel for the number of voice channels',
	commandType: ['application', 'message'],
	category: 'serverstats',
	args: [],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		let channelName = await client.extras.getTemplate(ctx.guild.id);
		channelName = channelName.replace(`{emoji}`, '🔊');
		channelName = channelName.replace(
			`{name}`,
			`Voice Channels: ${
				(await client.helpers.getChannels(ctx.guild.id)).filter((ch) => ch.type == ChannelTypes.GuildVoice).size || 0
			}`,
		);

		client.helpers
			.createChannel(ctx.guildId, {
				name: channelName,
				type: ChannelTypes.GuildVoice,
				permissionOverwrites: [
					{
						deny: ['CONNECT'],
						type: 0,
						id: ctx.guildId,
					},
				],
			})
			.then(async (channel) => {
				Schema.findOne({ Guild: ctx.guildId }, async (err, data) => {
					if (data) {
						data.VoiceChannels = channel.id;
						data.save();
					} else {
						new Schema({
							Guild: ctx.guildId,
							VoiceChannels: channel.id,
						}).save();
					}
				});

				client.extras.succNormal(
					{
						text: `Voice channel count created!`,
						fields: [
							{
								name: `→ Channel`,
								value: `<#${channel.id}>`,
							},
						],
						type: 'editreply',
					},
					ctx,
				);
			});
	},
};
