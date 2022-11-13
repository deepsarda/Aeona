import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'stealemoji',
	description: 'Generate a chat message',
	commandType: ['application', 'message'],
	category: 'info',
	args: [
		{
			name: 'emoji',
			description: 'The emoji you want to use',
			required: true,
			optionType: 'String',
		},
	],
	userGuildPermissions: ['MANAGE_EMOJIS'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild+" "+ctx.channel+" "+ctx.user);

		const rawEmoji = ctx.options.getString('emoji', true);
		const parsedEmoji = parseEmoji(rawEmoji);
		if (!parsedEmoji) return;
		if (parsedEmoji.id) {
			const extension = parsedEmoji.animated ? '.gif' : '.png';
			const url = `https://cdn.discordapp.com/emojis/${parsedEmoji.id + extension}`;
			client.helpers.createEmoji(ctx.guild.id + '', { name: parsedEmoji.name, image: url }).then((emoji) => {
				client.extras.succNormal(
					{
						text: `Emoji successfully added to the server`,
						fields: [
							{
								name: '→ Emoji',
								value: `${emoji}`,
								inline: true,
							},
							{
								name: '→ Emoji name',
								value: `${emoji.name}`,
								inline: true,
							},
							{
								name: '→ Emoji id',
								value: `${emoji.id}`,
								inline: true,
							},
						],
						type: 'reply',
					},
					ctx,
				);
			});
		} else {
			client.extras.errNormal(
				{
					error: 'Emoji not found!',
					type: 'reply',
				},
				ctx,
			);
		}
	},
};
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
