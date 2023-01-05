import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { ChannelTypes } from 'discordeno/types';

import Schema from '../../database/models/stats.js';
import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'emoji',
	description: 'Create a stats channel for the emoji count',
	commandType: ['application', 'message'],
	category: 'serverstats',
	args: [],
	userGuildPermissions: ['MANAGE_CHANNELS'],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		let channelName = await client.extras.getTemplate(ctx.guild!.id);
		channelName = channelName.replace(`{emoji}`, '😛');
		channelName = channelName.replace(
			`{name}`,
			`Emojis: ${(await client.helpers.getEmojis(ctx.guild!.id)).size || '0'}`,
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
						data.Emojis = channel.id;
						data.save();
					} else {
						new Schema({
							Guild: ctx.guild!.id,
							Emojis: channel.id,
						}).save();
					}
				});

				client.extras.succNormal(
					{
						text: `Emoji's count created!`,
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
