import moment from 'moment-timezone';

import Schema from '../../database/models/stats.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
import { ChannelTypes } from 'discordeno/types';
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
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const time = ctx.options.getString('timezone', true);
		if (!moment().tz(time))
			return client.extras.errNormal(
				{
					error: `Timezone is not valid`,
					type: 'editreply',
				},
				ctx,
			);

		const timeNow = moment().tz(time).format('HH:mm (z)');

		let channelName = await client.extras.getTemplate(ctx.guild.id);
		channelName = channelName.replace(`{emoji}`, '⏰');
		channelName = channelName.replace(`{name}`, `${timeNow}`);

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
						data.Time = channel.id;
						data.TimeZone = time;
						data.save();
					} else {
						new Schema({
							Guild: ctx.guildId,
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
