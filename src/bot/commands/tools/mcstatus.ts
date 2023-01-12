import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import fetch from 'node-fetch';

import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'mcstatus',
	description: 'Generate a chat message',
	commandType: ['application', 'message'],
	category: 'tools',
	args: [
		{
			name: 'ip',
			description: 'ip address of the server',
			required: true,
			type: 'String',
		},
	],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const ip = ctx.options.getString('ip', true);

		if (ip == null) return client.extras.errUsage({ usage: 'mcstatus [ip]', type: 'reply' }, ctx);

		fetch(`https://api.mcsrvstat.us/2/${ip}`)
			.then((res) => res.json())
			.catch()
			.then(async (json: any) => {
				if (!json.players) return client.extras.errNormal({ error: "Can't find the server!", type: 'reply' }, ctx);

				return client.extras.embed(
					{
						title: `${ip}`,
						thumbnail: `https://eu.mc-api.net/v3/server/favicon/${ip}`,
						fields: [
							{
								name: 'Online',
								value: `${json.online}`,
								inline: true,
							},
							{
								name: 'Version',
								value: `${json.version}`,
								inline: true,
							},
							{
								name: 'Players online',
								value: `${json.players.online}/${json.players.max}`,
								inline: true,
							},
						],
						type: 'reply',
					},
					ctx,
				);
			})
			.catch();
	},
} as CommandOptions;
