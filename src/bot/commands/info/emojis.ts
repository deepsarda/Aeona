import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'emojies',
	description: 'See the emojies of this server',
	commandType: ['application', 'message'],
	category: 'info',
	args: [],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		let Emojis = '';
		let EmojisAnimated = '';
		let EmojiCount = 0;
		let Animated = 0;
		let OverallEmojis = 0;

		ctx.guild.emojis.forEach((emoji) => {
			OverallEmojis++;
			if (emoji.toggles.animated) {
				Animated++;
				EmojisAnimated += '<a:' + emoji.name + ':' + emoji.id + '>';
			} else {
				EmojiCount++;
				Emojis += '<:' + emoji.name + ':' + emoji.id + '>';
			}
		});

		client.extras.embed(
			{
				title: `Emoji's!`,
				desc: `${OverallEmojis} Emoji's - ${ctx.guild.name}`,
				fields: [
					{
						name: `Animated [${Animated}]`,
						value: EmojisAnimated.substr(0, 1021) + '...',
						inline: false,
					},
					{
						name: `Standard [${EmojiCount}]`,
						value: Emojis.substr(0, 1021) + '...',
						inline: false,
					},
				],
				type: 'reply',
			},
			ctx,
		);
	},
};
