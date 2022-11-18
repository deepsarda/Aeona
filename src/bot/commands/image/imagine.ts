import fetch from 'node-fetch';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';

async function query(data) {
	const response = await fetch('https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5', {
		headers: { Authorization: `Bearer ${process.env.APIKEY}` },
		method: 'POST',
		body: JSON.stringify(data),
	});
	const result = await response.blob();
	return result;
}

export default {
	name: 'imagine',
	description: 'Generate a image',
	commandType: ['application', 'message'],
	category: 'image',
	args: [
		{
			name: 'prompt',
			description: 'describe the image you want to generate',
			required: true,
			type: 'String',
		},
	],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const prompt = ctx.options.getLongString('prompt', true);
		console.log('Prompt: ' + prompt);
		query({
			inputs:
				prompt +
				'  detailed matte painting, deep color, fantastical, intricate detail, splash screen, complementary colors, fantasy concept art, 8k resolution trending on Artstation Unreal Engine 5',
			options: {
				wait_for_model: true,
			},
		}).then(async (response) => {
			console.log('HMMM');
			ctx.reply({
				content: 'PORMPT: ' + prompt,
				file: [
					{
						blob: response,
						name: 'image.jpg',
					},
				],
			});
		});
	},
};