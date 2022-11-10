import figlet from 'figlet';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'ascii',
	description: 'Make ASCII text from your text',
	commandType: ['application', 'message'],
	category: 'fun',
	args: [
		{
			name: 'text',
			description: 'The text to make ASCII',
			required: true,
			type: 'String',
		},
	],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const msg = ctx.options.getString('text', true);
		if (!msg) return;
		if (msg.length > 2000)
			return client.extras.errNormal(
				{
					error: 'Please provide text shorter than 2000 character!',
					type: 'reply',
				},
				ctx,
			);

		figlet.text(msg, function (err, data) {
			if (err) {
				return client.extras.errNormal({ error: 'Something went wrong!', type: 'edit' }, ctx);
			}

			client.extras.embed(
				{
					title: 'Ascii',
					desc: `\`\`\` ${data} \`\`\``,
					type: 'reply',
				},
				ctx,
			);
		});
	},
};
