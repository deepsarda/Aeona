import mongoose from 'mongoose';

import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { AeonaBot } from '../../extras/index.js';
export default {
	name: 'ping',
	description: 'Get my ping',
	commandType: ['application', 'message'],
	category: 'info',
	args: [],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		const time = new Date().getTime();
		client.extras
			.simpleEmbed(
				{
					desc: `${client.extras.emotes.animated.loading} Calculating ping...`,
					type: 'reply',
				},
				ctx,
			)
			.then((resultMessage) => {
				const ping = Math.floor(resultMessage.timestamp - time);

				mongoose.connection.db.admin().ping(function (err, result) {
					if (!result) return;
					const mongooseSeconds = (result.ok % 60000) / 1000;
					const pingSeconds = (ping % 60000) / 1000;

					client.extras.editEmbed(
						{
							title: `Pong`,
							desc: `Check out how fast our bot is`,
							fields: [
								{
									name: '→ Bot Ping',
									value: `${ping}ms (${pingSeconds}s)`,
									inline: true,
								},
								{
									name: '→ Database Latency',
									value: `${result.ok}ms (${mongooseSeconds}s)`,
									inline: true,
								},
							],
						},
						resultMessage,
					);
				});
			});
	},
} as CommandOptions;
