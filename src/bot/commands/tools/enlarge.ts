import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'enlarge',
	description: 'Enlarge a emoji',
	commandType: ['application', 'message'],
	category: 'tools',
	args: [
		{
			name: 'emoji',
			description: 'the emoji to use',
			required: true,
			type: 'String',
		},
	],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const emoji = ctx.options.getString('emoji', true);
		const parsedEmoji = parseEmoji(emoji);

		if (parsedEmoji) {
			const ex = parsedEmoji.animated ? '.gif' : '.png';
			const url = `https://cdn.discordapp.com/emojis/${parsedEmoji.id + ex}`;

			return client.extras.embed(
				{
					image: url,
					type: 'reply',
				},
				ctx,
			);
		} else {
			client.extras.errNormal({ error: 'Please supply a valid emoji!', type: 'reply' }, ctx);
		}
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
