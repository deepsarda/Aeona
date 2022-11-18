import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'qrcode',
	description: 'Make a QR Code for a link',
	commandType: ['application', 'message'],
	category: 'tools',
	args: [
		{
			name: 'text',
			description: 'the text to convert',
			required: true,
			type: 'String',
		},
	],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const text = ctx.options.getLongString('text', true);

		client.extras.embed(
			{
				title: `📱 Qrcode`,
				image: `https://api.qrserver.com/v1/create-qr-code/?size=1024x1024&data=${text.replace(
					new RegExp(' ', 'g'),
					'%20',
				)}`,
				type: 'editreply',
			},
			ctx,
		);
	},
};
