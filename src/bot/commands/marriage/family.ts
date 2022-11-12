import Schema from '../../database/models/family.js';
import { Canvas, loadImage } from 'canvas';
import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
import { BigString } from 'discordeno/types';
import { Blob } from 'buffer';

export default {
	name: 'family',
	description: 'See your family',
	commandType: ['application', 'message'],
	category: 'marriage',
	args: [
		{
			name: 'user',
			description: 'Name of the user',
			required: false,
			type: 'User',
		},
	],
	async execute(client: AmethystBot, context: Context) {
		if (!context.guild || !context.user || !context.channel) return;
		const target = (await context.options.getUser('user')) || context.user;

		const data = await Schema.findOne({
			User: target.id + '',
		});
		const canvas = new Canvas(960, 960);
		const ctx = canvas.getContext('2d');
		const image = await loadImage(
			'https://media.discordapp.net/attachments/1023100219975544865/1040850327395631104/unknown.png',
		);

		ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
		ctx.font = '30px Arial ';
		ctx.fillStyle = 'rgba(9, 226, 230, 0.5)';
		const boxSizeX = 350;
		const boxSizeY = 40;
		const deltaXText = 4;
		const deltaYText = 24;
		const startX = 5;
		const startY = 5;
		const verticalSpacing = 10;
		const horizontalSpacing = 10;

		const parent = data && data.Parent.length > 0;
		const parent1 = parent ? data.Parent[0] : '';
		let json;
		if (parent) {
			json = await getFamily(parent1, client);
		} else {
			json = await getFamily(target.id, client);
		}

		console.log(json);
		function drawRect(x, y, text) {
			ctx.fillStyle = 'white';
			ctx.fillText(text, x + deltaXText, y + deltaYText);
			ctx.fillStyle = 'rgba(9, 226, 230, 0.5)';
			ctx.fillRect(x, y, boxSizeX, boxSizeY);
		}

		function drawLine(x1, y1, x2, y2) {
			ctx.strokeStyle = 'white';
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.closePath();
			ctx.stroke();
		}

		///Draw all Siblings
		function drawSiblings(siblings, x, y) {
			if (siblings && siblings.length > 0) {
				for (const s in siblings) {
					const sibling = siblings[s];
					//x += boxSizeX + 10;
					//startY += boxSizeY;
					drawLine(x + boxSizeX, y+ 10, boxSizeX + 15, y+ 10);
					x += boxSizeX + horizontalSpacing;

					drawRect(x, y, sibling.name);
				}
			}
		}

		/// Draw all Childrens
		function drawChildrens(childrens, x, y) {
			if (childrens && childrens.length > 0) {
				y = y + verticalSpacing;
				y += boxSizeY;
				for (const s in childrens) {
					const child = childrens[s];
					drawRect(x, y, child.name);
					drawSiblings(child.sibling, x, y);
					drawChildrens(child.child, x, y);

					x += boxSizeX + boxSizeX * (child.sibling && child.sibling.length > 0 ? child.sibling.length : 1) + 20;
				}
			}
		}

		//Root
		drawRect(startX, startY, json.name);
		drawSiblings(json.sibling, startX, startY);
		drawChildrens(json.child, startX, startY);
		context.reply({
			file: [
				{
					blob: dataURItoBlob(canvas.toDataURL()),
					name: 'family.png',
				},
			],
		});
	},
};
function dataURItoBlob(dataURI) {
	const byteString = atob(dataURI.split(',')[1]);
	const ab = new ArrayBuffer(byteString.length);
	const ia = new Uint8Array(ab);
	for (let i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}
	//@ts-ignore
	return new Blob([ab], { type: 'image/jpeg' });
}

async function getFamily(userId: BigString, client: AmethystBot) {
	const data = await Schema.findOne({
		User: userId + '',
	});
	if (!data) return;

	const user = await client.helpers.getUser(userId);

	const children = [];
	if (data.Children)
		for (let i = 0; i < data.Children.length; i++) children.push(await getFamily(data.Children[i], client));

	return {
		name: user.username,
		sibling: data.Partner
			? [
					{
						name: (await client.cache.users.get(BigInt(data.Partner as string))).username,
						relation: 'Spouse',
					},
			  ]
			: [],
		child: children,
	};
}
