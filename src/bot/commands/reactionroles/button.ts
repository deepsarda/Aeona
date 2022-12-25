import Schema from '../../database/models/reactionRoles.js';

import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { AeonaBot } from '../../extras/index.js';
export default {
	name: 'button',
	description: 'Generate a button menu.',
	commandType: ['application', 'message'],
	category: 'reactionroles',
	args: [
		{
			name: 'name',
			description: 'The name of the reaction roles',
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
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		const category = ctx.options.getString('name', true);
		const channel = (await ctx.options.getChannel('channel')) || ctx.channel;

		const lower = category.toLowerCase();
		const upper = lower.charAt(0).toUpperCase() + lower.substring(1);

		Schema.findOne({ Guild: ctx.guild!.id, Category: category }, async (err, data) => {
			if (!data)
				return client.extras.errNormal(
					{
						error: `No data found!`,
						type: 'reply',
					},
					ctx,
				);
			const a = Object.keys(data.Roles);
			const roles = await client.helpers.getRoles(ctx.guild!.id);
			const mapped: string[] = [];
			for (let i = 0; i < a.length; i++) {
				const b = a[i];
				const role = roles.get(BigInt(data.Roles[b][0]));
				if (role) mapped.push(`${data.Roles[b][1].raw} | <@&${role.id}>`);
			}
			const mappedstring = mapped.join('\n');

			const reactions = Object.values(data.Roles).map((val: any) => val[1].raw);
			const sendComponents = client.extras.buttonReactions('id', reactions);

			client.extras
				.embed(
					{
						title: `${upper} Roles`,
						desc: `Choose your roles by pressing the button! \n\n${mappedstring}`,
						components: sendComponents,
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
					text: 'Reaction panel successfully created! \n TIP: `Use the commands under the *embed* category to modify thier look.` \n Example use: `+editembed`',
					type: 'ephemeral',
				},
				ctx,
			);
		});
	},
} as CommandOptions;
