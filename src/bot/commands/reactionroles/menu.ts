import Schema from '../../database/models/reactionRoles.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework/*';
import { Components } from '@thereallonewolf/amethystframework';
export default {
	name: 'menu',
	description: 'Generate a menu reactionroles',
	commandType: ['application', 'message'],
	category: 'reactionroles',
	args: [
		{
			name: 'category',
			description: 'The category of the reaction roles',
			required: true,
			type: 'String',
		},
		{
			name: 'channel',
			description: 'The channel to make the menu in.',
			required: true,
			type: 'Channel',
		},
	],
	userGuildPermissions: ['MANAGE_ROLES'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		const category = ctx.options.getString('category', true);
		const channel = (await ctx.options.getChannel('channel')) || ctx.channel;

		const lower = category.toLowerCase();
		const upper = lower.charAt(0).toUpperCase() + lower.substring(1);

		Schema.findOne({ Guild: ctx.guildId, Category: category }, async (err, data) => {
			if (!data)
				return client.extras.errNormal(
					{
						error: `No data found!`,
						type: 'reply',
					},
					ctx,
				);

			const a = Object.keys(data.Roles);

			const map = [];
			for (let i = 0; i < a.length; i++) {
				const b = a[i];
				const role = await client.cache.roles.get(data.Roles[b][0], ctx.guildId, true);
				map.push(`${data.Roles[b][1].raw} | <@&${role.id}>`);
			}
			const mappedstring = map.join('\n');

			const labels = [];
			for (let i = 0; i < a.length; i++) {
				const b = a[i];
				const role = await client.cache.roles.get(data.Roles[b][0], ctx.guildId, true);
				labels.push({
					label: `${data.Roles[b][1].raw} <@&${role.id}>`,
					emoji: data.Roles[b][1].raw,
					value: data.Roles[b][1].raw,
				});
			}

			const row = new Components();
			row.addSelectComponent('Choose your row', 'reaction_select', labels, '❌ Nothing selected', 1);
			client.extras
				.embed(
					{
						title: `${upper} Roles`,
						desc: `_____ \n\nChoose your roles in the menu! \n\n${mappedstring}`,
						components: row,
						type: 'reply',
					},
					channel,
				)
				.then((msg) => {
					data.Message = msg.id;
					data.save();
				});

			client.extras.succNormal(
				{
					text: 'Reaction panel successfully created!',
					type: 'ephemeral',
				},
				ctx,
			);
		});
	},
};
