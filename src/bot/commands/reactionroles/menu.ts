import Schema from '../../database/models/reactionRoles';

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
			type: 'String',
		},
	],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const category = ctx.options.getString('category');
		const channel = ctx.options.getChannel('channel') || ctx.channel;

		const lower = category.toLowerCase();
		const upper = lower.charAt(0).toUpperCase() + lower.substring(1);

		Schema.findOne({ Guild: ctx.guildId, Category: category }, async (err, data) => {
			if (!data)
				return client.extras.errNormal(
					{
						error: `No data found!`,
						type: 'editreply',
					},
					ctx,
				);

			const a = Object.keys(data.Roles);
			const map = [];
			for (const b in a) {
				const role = await client.cache.roles.get(data.Roles[b][0], ctx.guildId, true);
				map.push(`${data.Roles[b][1].raw} | <&${role.id}>`);
			}
			const mappedstring = map.join('\n');

			const c = Object.keys(data.Roles);
			const labels = [];
			for (const b in c) {
				const role = await client.cache.roles.get(data.Roles[b][0], ctx.guildId, true);
				labels.push({
					label: `${role.name}`,
					description: `Add or remove the role ${role.name}`,
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
						desc: `_____ \n\nChoose your roles in the menu! \n\n${map}`,
						components: [row],
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
					type: 'ephemeraledit',
				},
				ctx,
			);
		});
	},
};
