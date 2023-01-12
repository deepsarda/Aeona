import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import Schema from '../../database/models/reactionRoles.js';
import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'add',
	description: 'Create a reactionrole',
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
			name: 'role',
			description: 'The role to give',
			required: true,
			type: 'Role',
		},
		{
			name: 'emoji',
			description: 'The emoji for the reaction',
			required: true,
			type: 'String',
		},
	],
	userGuildPermissions: ['MANAGE_ROLES'],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const category = ctx.options.getString('name', true);
		const role = await ctx.options.getRole('role', true);
		const emoji = ctx.options.getString('emoji', true);

		const parsedEmoji = parseEmoji(emoji);
		if (!parsedEmoji)
			return client.extras.errNormal(
				{
					error: `Emoji not found in this server!`,
					type: 'reply',
				},
				ctx,
			);

		Schema.findOne({ Guild: ctx.guild!.id, Category: category }, async (err, data) => {
			if (data) {
				data.Roles[emoji] = [
					role.id + '',
					{
						id: parsedEmoji.id + '',
						raw: emoji,
					},
				];

				await Schema.findOneAndUpdate({ Guild: ctx.guild!.id, Category: category }, data);
			} else {
				new Schema({
					Guild: ctx.guild!.id,
					Message: 0,
					Category: category,
					Roles: {
						[emoji]: [
							role.id + '',
							{
								id: parsedEmoji.id + '',
								raw: emoji,
							},
						],
					},
				}).save();
			}

			client.extras.succNormal(
				{
					text: 'Reaction role successfully created! Create a panel in the following way',
					fields: [
						{
							name: `Menu panel`,
							value: `\`/reactionroles menu [category name]\``,
							inline: true,
						},
						{
							name: `Button panel`,
							value: `\`/reactionroles button [category name]\``,
							inline: true,
						},
					],
					type: 'reply',
				},
				ctx,
			);
		});
	},
} as CommandOptions;
function parseEmoji(text: string) {
	if (text.includes('%')) text = decodeURIComponent(text);
	if (!text.includes(':'))
		return {
			name: text,
			id: undefined,

			animated: true,
			requireColons: true,
		};
	const match = text.match(/<?(?:(a):)?(\w{2,32}):(\d{17,19})?>?/);
	return match && { animated: Boolean(match[1]), name: match[2], id: match[3] };
}
