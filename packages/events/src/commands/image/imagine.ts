import {
	CommandOptions,
	Components,
	Context,
} from '@thereallonewolf/amethystframework';
import Filter from 'bad-words';
import fetch from 'node-fetch';

import { AeonaBot } from '../../extras/index.js';

const filter = new Filter();
filter.addWords('nake', 'naked', 'nude', 'nudes', 'nipples');
/*
async function query(data: any) {
	const response = await fetch('https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1-base', {
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
	async execute(client: AeonaBot, ctx: Context) {
		try {
			if (!ctx.guild || !ctx.user || !ctx.channel) return;
			const prompt = ctx.options.getLongString('prompt', true);
			if (filter.isProfane(prompt))
				return ctx.reply({
					content: 'This prompt is either profane, nfsw or both.',
				});
			const comp = new Components();
			comp.addSelectComponent('Choose your style', 'style', [
				{
					label: 'accurate',
					description: 'Generates the image most accurate to your prompt but will be less amazing.',
					value: 'accurate',
				},
				{
					label: 'dramatic',
					description: 'Not the most accurate but generates the best images',
					value: 'dramatic',
				},
				{
					label: 'digital art',
					description: 'Best for generating images.',
					value: 'digital',
				},
				{
					label: 'portrait',
					description: 'Best for images of a single living being.',
					value: 'portrait',
				},
				{
					label: 'photo',
					description: 'One of the most accurate and best for real life images. Prefer this over accurate.',
					value: 'photo',
				},
				{
					label: 'fantasy',
					description: 'Generate fantasy style images.',
					value: 'fantasy',
				},
				{
					label: 'sci-fi',
					description: 'Generate fantasy style images.',
					value: 'sci-fi',
				},
				{
					label: 'anime',
					description: 'Make the generated image in the style of a anime',
					value: 'anime',
				},
				{
					label: 'neo',
					description: 'Gets some neo led colors for your image.',
					value: 'neo',
				},
				{
					label: 'cgi',
					description: 'Make your image like a cgi character.',
					value: 'cgi',
				},
				{
					label: 'oil painting',
					description: 'Make your image like a oil painting',
					value: 'oil',
				},
				{
					label: 'horror',
					description: 'Give your art a horror feeling',
					value: 'horror',
				},
				{
					label: 'steampunk',
					description: 'Make your art in a retro style',
					value: 'steampunk',
				},
				{
					label: 'cyberpunk',
					description: 'Show the future in your images',
					value: 'cyberpunk',
				},
				{
					label: 'synthwave',
					description: 'Make your art colorful',
					value: 'synthwave',
				},
				{
					label: '3D Game',
					description: 'Make your image look like a 3D game',
					value: '3d',
				},
				{
					label: 'epic',
					description: 'Set your image in a epic style',
					value: 'epic',
				},
				{
					label: 'comic',
					description: 'Make your image in a comic strip style does not work all the time!',
					value: 'comic',
				},
				{
					label: 'charcoal',
					description: 'Make the image in charcoal',
					value: 'charcoal',
				},
			]);
			let modifiers =
				'  lens flares, cinematic, hdri, matte painting, concept art, celestial, soft render, highly detailed, cgsociety, octane render, trending on artstation, architectural HD, HQ, 4k, 8k';

			const msg = await client.helpers.sendMessage(ctx.channel.id, {
				content: 'Choose your style...',
				components: comp,
				messageReference: {
					messageId: ctx.message?.id,
					failIfNotExists: false,
				},
			});

			const c = await client.amethystUtils.awaitComponent(msg.id, {
				filter: (bot, data) => data.user.id == ctx.author?.id,
			});
			await client.helpers.editMessage(ctx.channel.id, msg.id, {
				content: '<a:F_Loading:1008013111913103401> GENERATING....',
				components: [],
			});
			switch (c.data?.values![0]) {
				case 'accurate':
					modifiers =
						'| blender, !!!!text!!!!, disfigured, repetitive, cropped, lowres, deformed, old, nfsw, childish, cropped, out of frame : -3';
					break;
				case 'portrait':
					modifiers =
						'  head and shoulders portrait, 8k resolution concept art portrait by senior artist, Artgerm, WLOP, Alphonse Mucha dynamic lighting hyperdetailed intricately detailed Splash art trending on Artstation triadic colors Unreal Engine 5 volumetric lighting | blender, !!!!text!!!!, disfigured, repetitive, cropped, lowres, deformed, old, nfsw, childish, cropped, out of frame : -3';
					break;
				case 'digital':
					modifiers =
						', concept art by senior character artist, cgsociety, plasticien, unreal engine 5, artstation hd, concept art, an ambient occlusion render by Raphael, featured on zbrush central, photorealism, reimagined by industrial light and magic, rendered in maya, rendered in cinema4d !!!!!Centered composition!!!!!: 6 | bad art, strange colours, sketch, lacklustre, repetitive, cropped, lowres, deformed, old, nfsw, childish: -2';
					break;
				case 'photo':
					modifiers =
						', wide shot, ultrarealistic uhd faces, Kodak Ultra Max 800, pexels, 85mm, casual pose, 35mm film roll photo, hard light, detailed skin texture, masterpiece, sharp focus, pretty, lovely, adorable, attractive, hasselblad, candid street portrait : 6 | blender, cropped, lowres, poorly drawn face, out of frame, poorly drawn hands, double, blurred, disfigured, deformed, nfsw, repetitive, black and white : -2';
					break;
				case 'fantasy':
					modifiers =
						', !!!!!fantasy art!!!!!, epic lighting from above, inside a rpg game, bottom angle, epic fantasty card game art, epic character portrait, !!!!!glowing and epic!!!!!, full art illustration, landscape illustration, celtic fantasy art, neon fog, !!!!!!!concept art by senior environment artist!!!!!!!!!!!!!!Senior Character Artist!!!!!!!: 6 | blender, !!!!text!!!!, disfigured, repetitive, cropped, lowres, deformed, old, nfsw, childish, cropped, out of frame : -3';
					break;
				case 'sci-fi':
					modifiers =
						', futuristic city backdrop, in a futuristic cyberpunk city, dark futuristic city, cybernetic city background, futuristic city background, photo of futuristic cityscape, in fantasy sci-fi city, night, cyberpunk city background, hd, artstation, blender, maya, unreal engine, good lighting, wide lens, neon lights, vaporwave | blender, !!!!text!!!!, disfigured, repetitive, cropped, lowres, deformed, old, nfsw, childish, cropped, out of frame : -3';
					break;
				case 'anime':
					modifiers =
						' Studio Ghibli, Anime Key Visual, by Makoto Shinkai, Deep Color, Intricate, 8k resolution concept art, Natural Lighting, Beautiful Composition | blender, !!!!text!!!!, disfigured, repetitive, cropped, lowres, deformed, old, nfsw, childish, cropped, out of frame : -3';
					break;
				case 'neo':
					modifiers =
						' neo-impressionism expressionist style oil painting, smooth post-impressionist impasto acrylic painting, thick layers of colourful textured paint | blender, !!!!text!!!!, disfigured, repetitive, cropped, lowres, deformed, old, nfsw, childish, cropped, out of frame : -3';
					break;
				case 'oil':
					modifiers =
						' concept art by senior character artist, cgsociety, plasticien, unreal engine 5, artstation hd, concept art, an ambient occlusion render by Raphael, featured on zbrush central, photorealism, reimagined by industrial light and magic, rendered in maya, rendered in cinema4d !!!!!Centered composition!!!!! | blender, !!!!text!!!!, disfigured, repetitive, cropped, lowres, deformed, old, nfsw, childish, cropped, out of frame : -3';
					break;
				case 'horror':
					modifiers =
						' horror Gustave Doré senior character artist | blender, !!!!text!!!!, disfigured, repetitive, cropped, lowres, deformed, old, nfsw, childish, cropped, out of frame : -3';
					break;
				case 'steampunk':
					modifiers =
						' steampunk engine | blender, !!!!text!!!!, disfigured, repetitive, cropped, lowres, deformed, old, nfsw, childish, cropped, out of frame : -3';
					break;
				case 'cyberpunk':
					modifiers =
						' cyberpunk 2099 blade runner 2049 neon | blender, !!!!text!!!!, disfigured, repetitive, cropped, lowres, deformed, old, nfsw, childish, cropped, out of frame : -3';
					break;
				case 'synthwave':
					modifiers =
						' synthwave neon retro | blender, !!!!text!!!!, disfigured, repetitive, cropped, lowres, deformed, old, nfsw, childish, cropped, out of frame : -3';
					break;
				case '3d':
					modifiers =
						' trending on Artstation Unreal Engine 3D shading shadow depth | blender, !!!!text!!!!, disfigured, repetitive, cropped, lowres, deformed, old, nfsw, childish, cropped, out of frame : -3';
					break;
				case 'epic':
					modifiers =
						' Epic cinematic brilliant stunning intricate meticulously detailed dramatic atmospheric maximalist digital matte painting | blender, !!!!text!!!!, disfigured, repetitive, cropped, lowres, deformed, old, nfsw, childish, cropped, out of frame : -3';
					break;
				case 'comic':
					modifiers =
						' Mark Brooks and Dan Mumford, comic book art, perfect, smooth | blender, !!!!text!!!!, disfigured, repetitive, cropped, lowres, deformed, old, nfsw, childish, cropped, out of frame : -3';
					break;
				case 'charcoal':
					modifiers =
						' hyperdetailed charcoal drawing | blender, !!!!text!!!!, disfigured, repetitive, cropped, lowres, deformed, old, nfsw, childish, cropped, out of frame : -3';
					break;
			}

			query({
				inputs: prompt + modifiers,
				options: {
					wait_for_model: true,
					use_cache: false,
				},
			}).then(async (response) => {
				client.helpers.deleteMessage(msg.channelId, msg.id);
				client.helpers.sendMessage('1044575489118978068', {
					content: '**Prompt:** ' + prompt + '\n **Mode:** ' + c.data?.values![0],
					file: [
						{
							blob: response,
							name: 'image.jpg',
						},
					],
				});
				const component = new Components();
				component.addSelectComponent(
					'Share your image!',
					'share-imagine_' + ctx.user?.id,
					[
						{
							label: 'Official Server',
							value: 'share-discord',
							description:
								'Share your image on the official discord server. Note: Your discord username and id will be shared.',
						},
					],
					'Share this image.',
				);
				ctx.reply({
					content: '**Prompt:** ' + prompt + '\n **Mode:** ' + c.data?.values![0],
					file: [
						{
							blob: response,
							name: 'image.jpg',
						},
					],
					components: component,
				});
			});
		} catch (e) {
			console.log(e);
		}
	},
} as CommandOptions;
*/

async function query(prompt, negative) {
	const response = await fetch(
		'http://localhost:8083/chatbot/image?prompt=' + prompt + '&negative=' + negative,

	);

	return await response.json();

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
	async execute(client: AeonaBot, ctx: Context) {
		try {
			if (!ctx.guild || !ctx.user || !ctx.channel) return;
			const prompt = ctx.options.getLongString('prompt', true);

			if (filter.isProfane(prompt))
				return ctx.reply({
					content: 'This prompt is either profane, nfsw or both.',
				});
			const comp = new Components();
			comp.addSelectComponent('Choose your style', 'style', [
				{
					label: 'accurate',
					description: 'Generates the image most accurate to your prompt but will be less amazing.',
					value: 'accurate',
				},
				{
					label: 'dramatic',
					description: 'Not the most accurate but generates the best images',
					value: 'dramatic',
				},
				{
					label: 'digital art',
					description: 'Best for generating images.',
					value: 'digital',
				},
				{
					label: 'portrait',
					description: 'Best for images of a single living being.',
					value: 'portrait',
				},
				{
					label: 'photo',
					description: 'One of the most accurate and best for real life images. Prefer this over accurate.',
					value: 'photo',
				},
				{
					label: 'fantasy',
					description: 'Generate fantasy style images.',
					value: 'fantasy',
				},
				{
					label: 'sci-fi',
					description: 'Generate fantasy style images.',
					value: 'sci-fi',
				},
				{
					label: 'anime',
					description: 'Make the generated image in the style of a anime',
					value: 'anime',
				},
				{
					label: 'neo',
					description: 'Gets some neo led colors for your image.',
					value: 'neo',
				},
				{
					label: 'cgi',
					description: 'Make your image like a cgi character.',
					value: 'cgi',
				},
				{
					label: 'oil painting',
					description: 'Make your image like a oil painting',
					value: 'oil',
				},
				{
					label: 'horror',
					description: 'Give your art a horror feeling',
					value: 'horror',
				},
				{
					label: 'steampunk',
					description: 'Make your art in a retro style',
					value: 'steampunk',
				},
				{
					label: 'cyberpunk',
					description: 'Show the future in your images',
					value: 'cyberpunk',
				},
				{
					label: 'synthwave',
					description: 'Make your art colorful',
					value: 'synthwave',
				},
				{
					label: '3D Game',
					description: 'Make your image look like a 3D game',
					value: '3d',
				},
				{
					label: 'epic',
					description: 'Set your image in a epic style',
					value: 'epic',
				},
				{
					label: 'comic',
					description: 'Make your image in a comic strip style does not work all the time!',
					value: 'comic',
				},
				{
					label: 'charcoal',
					description: 'Make the image in charcoal',
					value: 'charcoal',
				},
			]);
			let modifiers =
				' detailed matte painting, deep color, fantastical, intricate detail, splash screen, complementary colors, fantasy concept art, 8k resolution trending on Artstation Unreal Engine 5';

			const msg = (
				await ctx.reply({
					content: 'Choose your style...',
					components: comp,
					messageReference: {
						messageId: ctx.message?.id,
						failIfNotExists: false,
					},
				})
			).message!;

			const c = await client.amethystUtils.awaitComponent(msg.id, {
				filter: (bot, data) => data.user.id == ctx.author?.id,
			});
			let negative = "nfsw, nude, low quality, cropped"
			await client.helpers.editMessage(ctx.channel.id, msg.id, {
				content: 'GENERATING.... \n Have you tried +quote yet?',
				components: [],
			});
			switch (c.data?.values![0]) {
				case 'accurate':
					modifiers =
						'| blender, !!!!text!!!!, disfigured, repetitive, cropped, lowres, deformed, old, nfsw, childish, cropped, out of frame : -3';
					break;
				case 'portrait':
					modifiers =
						'  head and shoulders portrait, 8k resolution concept art portrait by senior artist, Artgerm, WLOP, Alphonse Mucha dynamic lighting hyperdetailed intricately detailed Splash art trending on Artstation triadic colors Unreal Engine 5 volumetric lighting | blender, !!!!text!!!!, disfigured, repetitive, cropped, lowres, deformed, old, nfsw, childish, cropped, out of frame : -3';
					break;
				case 'digital':
					modifiers =
						', concept art by senior character artist, cgsociety, plasticien, unreal engine 5, artstation hd, concept art, an ambient occlusion render by Raphael, featured on zbrush central, photorealism, reimagined by industrial light and magic, rendered in maya, rendered in cinema4d !!!!!Centered composition!!!!!: 6 | bad art, strange colours, sketch, lacklustre, repetitive, cropped, lowres, deformed, old, nfsw, childish: -2';
					negative = `2d earrings, tribal dance, risograph, white orchids, Egyptian Sumerian features, large temples, childish, nsfw`;
					break;
				case 'photo':
					modifiers =
						', wide shot, ultrarealistic uhd faces, Kodak Ultra Max 800, pexels, 85mm, casual pose, 35mm film roll photo, hard light, detailed skin texture, masterpiece, sharp focus, pretty, lovely, adorable, attractive, hasselblad, candid street portrait : 6 | blender, cropped, lowres, poorly drawn face, out of frame, poorly drawn hands, double, blurred, disfigured, deformed, nfsw, repetitive, black and white : -2';
					break;
				case 'fantasy':
					modifiers =
						', !!!!!fantasy art!!!!!, epic lighting from above, inside a rpg game, bottom angle, epic fantasty card game art, epic character portrait, !!!!!glowing and epic!!!!!, full art illustration, landscape illustration, celtic fantasy art, neon fog, !!!!!!!concept art by senior environment artist!!!!!!!!!!!!!!Senior Character Artist!!!!!!!: 6 | blender, !!!!text!!!!, disfigured, repetitive, cropped, lowres, deformed, old, nfsw, childish, cropped, out of frame : -3';
					negative = 'nsfw, blur, wood block print, in Africa, Kodak tri – x 35 mm, black lace,American flag, football players, house, mountain, woodblock print'
					break;
				case 'sci-fi':
					modifiers =
						', futuristic city backdrop, in a futuristic cyberpunk city, dark futuristic city, cybernetic city background, futuristic city background, photo of futuristic cityscape, in fantasy sci-fi city, night, cyberpunk city background, hd, artstation, blender, maya, unreal engine, good lighting, wide lens, neon lights, vaporwave | blender, !!!!text!!!!, disfigured, repetitive, cropped, lowres, deformed, old, nfsw, childish, cropped, out of frame : -3';
					break;
				case 'anime':
					modifiers =
						' Studio Ghibli, Anime Key Visual, by Makoto Shinkai, Deep Color, Intricate, 8k resolution concept art, Natural Lighting, Beautiful Composition | blender, !!!!text!!!!, disfigured, repetitive, cropped, lowres, deformed, old, nfsw, childish, cropped, out of frame : -3';
					break;
				case 'neo':
					modifiers =
						' neo-impressionism expressionist style oil painting, smooth post-impressionist impasto acrylic painting, thick layers of colourful textured paint | blender, !!!!text!!!!, disfigured, repetitive, cropped, lowres, deformed, old, nfsw, childish, cropped, out of frame : -3';
					break;
				case 'oil':
					modifiers =
						' concept art by senior character artist, cgsociety, plasticien, unreal engine 5, artstation hd, concept art, an ambient occlusion render by Raphael, featured on zbrush central, photorealism, reimagined by industrial light and magic, rendered in maya, rendered in cinema4d !!!!!Centered composition!!!!! | blender, !!!!text!!!!, disfigured, repetitive, cropped, lowres, deformed, old, nfsw, childish, cropped, out of frame : -3';
					break;
				case 'horror':
					modifiers =
						' horror Gustave Doré senior character artist | blender, !!!!text!!!!, disfigured, repetitive, cropped, lowres, deformed, old, nfsw, childish, cropped, out of frame : -3';
					break;
				case 'steampunk':
					modifiers =
						' steampunk engine | blender, !!!!text!!!!, disfigured, repetitive, cropped, lowres, deformed, old, nfsw, childish, cropped, out of frame : -3';
					break;
				case 'cyberpunk':
					modifiers =
						' cyberpunk 2099 blade runner 2049 neon | blender, !!!!text!!!!, disfigured, repetitive, cropped, lowres, deformed, old, nfsw, childish, cropped, out of frame : -3';
					break;
				case 'synthwave':
					modifiers =
						' synthwave neon retro | blender, !!!!text!!!!, disfigured, repetitive, cropped, lowres, deformed, old, nfsw, childish, cropped, out of frame : -3';
					break;
				case '3d':
					modifiers =
						' trending on Artstation Unreal Engine 3D shading shadow depth | blender, !!!!text!!!!, disfigured, repetitive, cropped, lowres, deformed, old, nfsw, childish, cropped, out of frame : -3';
					break;
				case 'epic':
					modifiers =
						' Epic cinematic brilliant stunning intricate meticulously detailed dramatic atmospheric maximalist digital matte painting | blender, !!!!text!!!!, disfigured, repetitive, cropped, lowres, deformed, old, nfsw, childish, cropped, out of frame : -3';
					break;
				case 'comic':
					modifiers =
						' Mark Brooks and Dan Mumford, comic book art, perfect, smooth | blender, !!!!text!!!!, disfigured, repetitive, cropped, lowres, deformed, old, nfsw, childish, cropped, out of frame : -3';
					negative = 'text, landscape, black and white old photo'
					break;
				case 'charcoal':
					modifiers =
						' hyperdetailed charcoal drawing | blender, !!!!text!!!!, disfigured, repetitive, cropped, lowres, deformed, old, nfsw, childish, cropped, out of frame : -3';
					break;
			}

			query(`${prompt}${modifiers}`, negative).then(async (response) => {
				console.log(response);

				client.helpers.deleteMessage(msg.channelId, msg.id);
				client.helpers.sendMessage('1044575489118978068', {
					content: `**Prompt:** ${prompt}\n **Mode:** ${c.data?.values![0]}`,
					file: [
						{
							blob: response.response[0],
							name: 'image1.png',
						},
						{
							blob: response.response[1],
							name: 'image2.png',
						},
						{
							blob: response.response[2],
							name: 'image2.png',
						},
						{
							blob: response.response[3],
							name: 'image4.png',
						},
					],
				});
				const component = new Components();
				component.addSelectComponent(
					'Share your image!',
					`share-imagine_${ctx.user?.id}`,
					[
						{
							label: 'Official Server',
							value: 'share-discord',
							description:
								'Share your image on the official discord server. Note: Your discord username and id will be shared.',
						},
					],
					'Share this image.',
				);
				client.helpers.sendMessage(ctx.channel?.id!, {
					content: `**Prompt:** ${prompt}\n **Mode:** ${c.data?.values![0]}`,
					file: [
						{
							blob: response.response[0],
							name: 'image1.png',
						},
						{
							blob: response.response[1],
							name: 'image2.png',
						},
						{
							blob: response.response[2],
							name: 'image2.png',
						},
						{
							blob: response.response[3],
							name: 'image4.png',
						},
					],
					components: component,
				});
			});
		} catch (e) {
			console.log(`Imagine Error: ${e}`);
		}
	},
} as CommandOptions;
