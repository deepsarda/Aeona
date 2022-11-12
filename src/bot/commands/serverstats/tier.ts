import Schema from '../../database/models/stats.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework/*';
import { ChannelTypes } from 'discordeno/types';
export default {
	name: 'tier',
	description: 'Create a stats channel for the boost tier',
	commandType: ['application', 'message'],
	category: 'serverstats',
	args: [],
	userGuildPermissions: ['MANAGE_CHANNELS'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;

		let channelName = await client.extras.getTemplate(ctx.guild.id);
		channelName = channelName.replace(`{emoji}`, '🥇');
		channelName = channelName.replace(`{name}`, `Tier: ${ctx.guild.premiumTier || '0'}`);

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
						data.BoostTier = channel.id;
						data.save();
					} else {
						new Schema({
							Guild: ctx.guildId,
							BoostTier: channel.id,
						}).save();
					}
				});

				client.extras.succNormal(
					{
						text: `Tier count created!`,
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
