import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';

import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'uptime',
	description: 'Get uptime of the bot',
	commandType: ['application', 'message'],
	category: 'info',
	args: [],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const uptime = new Date().getTime() - client.extras.startTime;
		momentDurationFormatSetup(moment);

		const duration = moment.duration(uptime).humanize();
		const upvalue = (Date.now() / 1000 - uptime / 1000).toFixed(0);

		client.extras.embed(
			{
				title: `Uptime`,
				desc: `See the uptime of Aeona`,
				fields: [
					{
						name: '→ Uptime',
						value: `${duration}`,
						inline: true,
					},
					{
						name: '→ Up Since',
						value: `<t:${upvalue}>`,
						inline: true,
					},
				],
				type: 'reply',
			},
			ctx,
		);
	},
} as CommandOptions;
