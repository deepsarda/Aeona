import Schema from '../../database/models/stats.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
import { ChannelTypes } from 'discordeno/types';
export default {
	name: 'bots',
	description: 'Create a stats channel for bot count',
	commandType: ['application', 'message'],
	category: 'serverstats',
	args: [],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const members = await client.helpers.getMembers(ctx.guild.id, {});

		let channelName = await client.extras.getTemplate(ctx.guild.id);
		channelName = channelName.replace(`{emoji}`, '🤖');
		channelName = channelName.replace(
			`{name}`,
			`Bots: ${members.filter((member) => member.user?.toggles.bot).size || 0}`,
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
						data.Bots = channel.id;
						data.save();
					} else {
						new Schema({
							Guild: ctx.guildId,
							Bots: channel.id,
						}).save();
					}
				});

				client.extras.succNormal(
					{
						text: `Bots count created!`,
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
