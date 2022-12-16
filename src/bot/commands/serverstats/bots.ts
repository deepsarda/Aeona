import Schema from '../../database/models/stats.js';

import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { AeonaBot } from '../../extras/index.js';
import { ChannelTypes } from 'discordeno/types';
export default {
	name: 'bots',
	description: 'Create a stats channel for bot count',
	commandType: ['application', 'message'],
	category: 'serverstats',
	args: [],
	userGuildPermissions: ['MANAGE_CHANNELS'],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		const members = await client.helpers.getMembers(ctx.guild!.id, {});

		let channelName = await client.extras.getTemplate(ctx.guild!.id);
		channelName = channelName.replace(`{emoji}`, '🤖');
		channelName = channelName.replace(
			`{name}`,
			`Bots: ${members.filter((member) => member.user?.toggles.bot!).size || 0}`,
		);

		client.helpers
			.createChannel(ctx.guild!.id!, {
				name: channelName,
				type: ChannelTypes.GuildVoice,
				permissionOverwrites: [
					{
						deny: ['CONNECT'],
						type: 0,
						id: ctx.guild!.id!,
					},
				],
			})
			.then(async (channel) => {
				Schema.findOne({ Guild: ctx.guild!.id }, async (err, data) => {
					if (data) {
						data.Bots = channel.id;
						data.save();
					} else {
						new Schema({
							Guild: ctx.guild!.id,
							Bots: channel.id,
						}).save();
					}
				});

				client.extras.embed(
					{
						title: `Bots count created!`,
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
} as CommandOptions;
