import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import bumpreminder from '../../database/models/bumpreminder.js';
import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'setup',
	description: 'Search npm for a package',
	commandType: ['application', 'message'],
	category: 'bumpreminder',
	args: [
		{
			name: 'channel',
			description: 'The channel to setup bump reminding for.',
			required: true,
			type: 'Channel',
		},
		{
			name: 'role',
			description: 'The role to ping reminding for.',
			required: true,
			type: 'Role',
		},
	],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const channel = await ctx.options.getChannel('channel', true);
		const role = await ctx.options.getRole('role', true);

		let reminder = await bumpreminder.findOne({ Guild: ctx.guild!.id });
		if (!reminder)
			reminder = new bumpreminder({
				Guild: ctx.guild!.id,
				Channel: channel.id,
				Role: role.id,
				LastBumpedReminder: Date.now(),
			});
		else {
			reminder.Channel = channel.id + '';
			reminder.Role = role.id + '';
		}

		client.extras.embed(
			{
				title: `Successfully setup bumpreminder`,
				desc: `I will automatically start reminding after next successful bump.`,
				fields: [
					{
						name: '→ Channel',
						value: `<#${channel.id}>`,
						inline: true,
					},
					{
						name: '→ Role',
						value: `<@&${role.id}>`,
						inline: true,
					},
				],
				type: 'reply',
			},
			ctx,
		);

		reminder.save();
	},
} as CommandOptions;
