import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { ChannelTypes } from 'discordeno/types';
import moment from 'moment-timezone';

import Schema from '../../database/models/stats.js';
import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'time',
	description: 'Create a stats channel for the time.',
	commandType: ['application', 'message'],
	category: 'serverstats',
	args: [
		{
			name: 'timezone',
			description: 'Timezone for the clock',
			required: true,
			type: 'String',
		},
	],
	userGuildPermissions: ['MANAGE_CHANNELS'],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const time = ctx.options.getString('timezone', true);
		if (!moment().tz(time))
			return client.extras.errNormal(
				{
					error: `Timezone is not valid`,
					type: 'reply',
				},
				ctx,
			);

		const timeNow = moment().tz(time).format('HH:mm (z)');

		let channelName = await client.extras.getTemplate(ctx.guild!.id);
		channelName = channelName.replace(`{emoji}`, '⏰');
		channelName = channelName.replace(`{name}`, `${timeNow}`);

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
						data.Time = channel.id;
						data.TimeZone = time;
						data.save();
					} else {
						new Schema({
							Guild: ctx.guild!.id,
							TimeZone: time,
							Time: channel.id,
						}).save();
					}
				});

				client.extras.succNormal(
					{
						text: `Voice channel count created!`,
						fields: [
							{
								name: `<:channel:1049292166343688192> Channel`,
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
