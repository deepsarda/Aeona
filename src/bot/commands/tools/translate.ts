import translate from '@iamtraction/google-translate';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'translate',
	description: 'Translate text to another language',
	commandType: ['application', 'message'],
	category: 'tools',
	args: [],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const language = ctx.options.getString('language', true);
		const text = ctx.options.getLongString('text', true);

		translate(text, { to: language })
			.then((res) => {
				client.extras.embed(
					{
						title: `${client.extras.emotes.normal.check} Success!`,
						desc: `I have translated the following`,
						fields: [
							{
								name: '📥 - Input',
								value: `${text}`,
								inline: false,
							},
							{
								name: '📤 - Output',
								value: `${res.text}`,
								inline: false,
							},
						],
						type: 'editreply',
					},
					ctx,
				);
			})
			.catch((err) => {
				console.log(err);
				client.extras.errNormal(
					{
						error: 'Please provide a valid ISO language code!',
						type: 'editreply',
					},
					ctx,
				);
			});
	},
};
