import Schema from '../../database/models/channelList.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'configurechannels',
	description: 'Change the channels automod channels',
	commandType: ['application', 'message'],
	category: 'automod',
	args: [
		{
			name: 'type',
			description: 'add/remove',
			required: true,
			type: 'String',
			choices: [
				{
					name: 'add',
					value: 'add',
				},
				{
					name: 'remove',
					value: 'remove',
				},
			],
		},
		{
			name: 'channel',
			type: 'Channel',
			description: 'The channel apply the change to',
			required: true,
		},
	],
	userGuildPermissions: ['MANAGE_GUILD'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const type = ctx.options.getString('type', true);
		const channel = await ctx.options.getChannel('channel', true);

		if (!channel) return;

		if (type == 'add') {
			Schema.findOne({ Guild: ctx.guildId }, async (err, data) => {
				if (!ctx.guild || !ctx.user || !ctx.channel) return;

				if (data) {
					if (data.Channels.includes(channel.id)) {
						return client.extras.errNormal(
							{
								error: `The channel ${channel} is already in the database!`,
								type: 'reply',
							},
							ctx,
						);
					}

					data.Channels.push(channel.id);
					data.save();
				} else {
					new Schema({
						Guild: ctx.guildId,
						Channels: channel.id,
					}).save();
				}
			});

			client.extras.succNormal(
				{
					text: `Channel has been added to the whitelist!`,
					fields: [
						{
							name: `→ Channel`,
							value: `${channel} (${channel.name})`,
						},
					],
					type: 'reply',
				},
				ctx,
			);
		} else if (type == 'remove') {
			Schema.findOne({ Guild: ctx.guildId }, async (err, data) => {
				if (!ctx.guild || !ctx.user || !ctx.channel) return;

				if (data) {
					if (!data.Channels.includes(channel.id)) {
						return client.extras.errNormal(
							{
								error: `The channel ${channel} doesn't exist in the database!`,
								type: 'reply',
							},
							ctx,
						);
					}

					const filtered = data.Channels.filter((target) => target !== channel.id);

					await Schema.findOneAndUpdate(
						{ Guild: ctx.guildId },
						{
							Guild: ctx.guildId,
							Channels: filtered,
						},
					);

					client.extras.succNormal(
						{
							text: `Channel has been removed from the whitelist!`,
							fields: [
								{
									name: `→ Channel`,
									value: `${channel} (${channel.name})`,
								},
							],
							type: 'reply',
						},
						ctx,
					);
				} else {
					return client.extras.errNormal(
						{
							error: `This guild has not data!`,
							type: 'reply',
						},
						ctx,
					);
				}
			});
		}
	},
};
