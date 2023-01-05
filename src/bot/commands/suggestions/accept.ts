import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import Schema from '../../database/models/suggestionChannels.js';
import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'accept',
	description: 'Generate a chat message',
	commandType: ['application', 'message'],
	category: 'suggestions',
	args: [
		{
			name: 'id',
			description: 'The id of the suggestion message',
			required: true,
			type: 'String',
		},
	],
	userGuildPermissions: ['MANAGE_MESSAGES'],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);

		const messageID = ctx.options.getString('id', true);

		const data = await Schema.findOne({ Guild: ctx.guild!.id });
		if (data) {
			const suggestionchannel = await client.cache.channels.get(BigInt(data.Channel!));
			const suggestEmbed = await client.helpers.getMessage(suggestionchannel!.guildId, messageID);
			const embedData = suggestEmbed.embeds[0];

			client.extras.editEmbed(
				{
					title: `Suggestion accepted`,
					desc: `\`\`\`${embedData.description}\`\`\``,
					color: client.extras.config.colors.succes,
					author: {
						name: embedData.author!.name,
						iconURL: embedData.author!.iconUrl,
					},
				},
				suggestEmbed,
			);

			try {
				const user = await client.helpers.getUser(
					BigInt(
						embedData.author!.name.substring(
							embedData.author!.name.lastIndexOf('(') + 1,
							embedData.author!.name.lastIndexOf(')'),
						),
					),
				);
				if (user) {
					client.extras
						.embed(
							{
								title: `Suggestion accepted`,
								desc: `Your suggestion in ${ctx.guild.name} has been accepted by a moderator!`,
								fields: [
									{
										name: `→ Suggestion`,
										value: `${embedData.description}`,
									},
								],
							},
							user,
						)
						.catch();
				}
			} catch {
				//stop lint error
			}

			client.extras.succNormal(
				{
					text: 'Suggestion successfully accepted',
					fields: [
						{
							name: `→ Suggestion`,
							value: `${embedData.description}`,
						},
					],
					type: 'reply',
				},
				ctx,
			);
		} else {
			client.extras.errNormal(
				{
					error: `No suggestion channel set! Please do the setup`,
					type: 'reply',
				},
				ctx,
			);
		}
	},
} as CommandOptions;
