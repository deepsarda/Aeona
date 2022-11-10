import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'chat',
	description: 'Generate a chat message',
	commandType: ['application', 'message'],
	category: 'info',
	args: [],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const uptime = new Date().getTime() - client.extras.startTime;
		momentDurationFormatSetup(moment);

		const duration = moment.duration().format('`D` [days], `H` [hrs], `m` [mins], `s` [secs]');
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
};
