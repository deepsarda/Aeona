import fetch from 'node-fetch';

import { AmethystBot, Context, Components } from '@thereallonewolf/amethystframework';

async function query(data) {
	const response = await fetch('https://api-inference.huggingface.co/models/prompthero/openjourney', {
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
	extras: {
		upvoteOnly: true,
	},
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log('Hmm');
		const prompt = ctx.options.getLongString('prompt', true);
		if (prompt.split(' ').length < 3)
			return ctx.reply({
				content: 'You need atleast 3 words',
			});
		const comp = new Components();
		let modifiers =
			' detailed matte painting, deep color, fantastical, intricate detail, splash screen, complementary colors, fantasy concept art, 8k resolution trending on Artstation Unreal Engine 5';
		comp
			.addButton('normal', 'Danger', 'normal')
			.addButton('dramatic', 'Success', 'dramatic')
			.addButton('portrait', 'Secondary', 'portrait')
			.addButton('photo', 'Secondary', 'photo')
			.addButton('fantasy', 'Secondary', 'fantasy')
			.addButton('anime', 'Secondary', 'anime')
			.addButton('neo', 'Secondary', 'neo')
			.addButton('cgi', 'Secondary', 'cgi')
			.addButton('oil painting', 'Secondary', 'oil')
			.addButton('horror', 'Secondary', 'horror')
			.addButton('steampunk', 'Secondary', 'steampunk')
			.addButton('cyberpunk', 'Secondary', 'cyberpunk')
			.addButton('synthwave', 'Secondary', 'synthwave')
			.addButton('3D Game', 'Secondary', '3d')
			.addButton('epic', 'Secondary', 'epic')
			.addButton('comic', 'Secondary', 'comic')
			.addButton('charcoal', 'Secondary', 'charcoal');

		const msg = await client.helpers.sendMessage(ctx.channel.id, {
			content: 'Choose your style...',
			components: comp,
		});

		const c = await client.amethystUtils.awaitComponent(msg.id);
		await client.helpers.editMessage(ctx.channel.id, msg.id, {
			content: 'GENERATING....',
			components: [],
		});
		switch (c.data.customId) {
			case 'normal':
				modifiers = '';
				break;
			case 'portrait':
				modifiers =
					' head and shoulders portrait, 8k resolution concept art portrait by Greg Rutkowski, Artgerm, WLOP, Alphonse Mucha dynamic lighting hyperdetailed intricately detailed Splash art trending on Artstation triadic colors Unreal Engine 5 volumetric lighting';
				break;
			case 'photo':
				modifiers =
					' Professional photography, bokeh, natural lighting, canon lens, shot on dslr 64 megapixels sharp focus';
				break;
			case 'fantasy':
				modifiers =
					' a masterpiece, 8k resolution, dark fantasy concept art, by Greg Rutkowski, dynamic lighting, hyperdetailed, intricately detailed, Splash screen art, trending on Artstation, deep color, Unreal Engine, volumetric lighting, Alphonse Mucha, Jordan Grimmer, purple and yellow complementary colours';
				break;
			case 'anime':
				modifiers =
					' Studio Ghibli, Anime Key Visual, by Makoto Shinkai, Deep Color, Intricate, 8k resolution concept art, Natural Lighting, Beautiful Composition';
				break;
			case 'neo':
				modifiers =
					' neo-impressionism expressionist style oil painting, smooth post-impressionist impasto acrylic painting, thick layers of colourful textured paint';
				break;
			case 'oil':
				modifiers = ' oil painting by James Gurney';
				break;
			case 'horror':
				modifiers = ' horror Gustave Doré Greg Rutkowski';
				break;
			case 'steampunk':
				modifiers = ' steampunk engine';
				break;
			case 'cyberpunk':
				modifiers = ' cyberpunk 2099 blade runner 2049 neon';
				break;
			case 'synthwave':
				modifiers = ' synthwave neon retro';
				break;
			case '3d':
				modifiers = ' trending on Artstation Unreal Engine 3D shading shadow depth';
				break;
			case 'epic':
				modifiers =
					' Epic cinematic brilliant stunning intricate meticulously detailed dramatic atmospheric maximalist digital matte painting';
				break;
			case 'comic':
				modifiers = ' Mark Brooks and Dan Mumford, comic book art, perfect, smooth';
				break;
			case 'charcoal':
				modifiers = ' hyperdetailed charcoal drawing';
				break;
		}

		query({
			inputs: prompt + ' mdjrny-v4 style ' + modifiers,
			options: {
				wait_for_model: true,
				use_cache: false,
			},
		}).then(async (response) => {
			await client.helpers.deleteMessage(msg.channelId, msg.id);
			client.helpers.sendMessage('1044575489118978068', {
				content: '**Prompt:** ' + prompt + '\n **Mode:** ' + c.data.customId,
				file: [
					{
						blob: response,
						name: 'image.jpg',
					},
				],
			});
			ctx.reply({
				content: '**Prompt:** ' + prompt + '\n **Mode:** ' + c.data.customId,
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
