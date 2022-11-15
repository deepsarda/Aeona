import Schema from '../../database/models/verify.js';

import { AmethystBot, Components, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'setverify',
	description: 'Configure the verification system',
	commandType: ['application', 'message'],
	category: 'config',
	args: [
		{
			name: 'enable',
			description: 'Enable or disable the verification system',
			required: true,
			type: 'Boolean',
		},
		{
			name: 'channel',
			description: 'Set the channel for the verification system',
			required: true,
			type: 'Channel',
		},
		{
			name: 'role',
			description: 'Set the role which will be given on successfully verifing',
			required: true,
			type: 'Role',
		},
	],
	userGuildPermissions: ['MANAGE_GUILD'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);

		const boolean = ctx.options.getBoolean('enable', true);
		const channel = await ctx.options.getChannel('channel', true);
		const role = await ctx.options.getRole('role', true);
		if (!channel) return;
		if (boolean == true) {
			const data = await Schema.findOne({ Guild: ctx.guildId });
			if (data) {
				data.Channel = channel.id + '';
				data.Role = role.id + '';
				data.save();
			} else {
				new Schema({
					Guild: ctx.guildId,
					Channel: channel.id + '',
					Role: role.id + '',
				}).save();
			}

			client.extras.succNormal(
				{
					text: `Verify panel has been successfully created`,
					fields: [
						{
							name: `→ Channel`,
							value: `<#${channel.id}> (${channel.name})`,
							inline: true,
						},
						{
							name: `→ Role`,
							value: `<@&${role.id}> (${role.name})`,
							inline: true,
						},
					],
					type: 'reply',
				},
				ctx,
			);
			const comp = new Components();
			comp.addButton('Click me', 'Success', 'verify', {
				emoji: '✅',
			});

			client.extras.embed(
				{
					title: `${ctx.guild.name} verify`,
					desc: `Click on the button to verify yourself`,
					components: comp,
				},
				channel,
			);
		}
	},
};
