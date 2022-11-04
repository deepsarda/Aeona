import mongoose from 'mongoose';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'chat',
	description: 'Generate a chat message',
	commandType: ['application', 'message'],
	category: 'info',
	args: [],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const time = new Date().getTime();
		client.extras
			.simpleEmbed(
				{
					desc: `${client.extras.emotes.animated.loading} Calculating ping...`,
					type: 'editreply',
				},
				ctx,
			)
			.then((resultMessage) => {
				const ping = Math.floor(resultMessage.createdTimestamp - time);

				mongoose.connection.db.admin().ping(function (err, result) {
					if (!result) return;
					const mongooseSeconds = (result.ok % 60000) / 1000;
					const pingSeconds = (ping % 60000) / 1000;

					client.extras.embed(
						{
							title: `Pong`,
							desc: `Check out how fast our bot is`,
							fields: [
								{
									name: '→ Bot latency',
									value: `${ping}ms (${pingSeconds}s)`,
									inline: true,
								},
								{
									name: '→ Database Latency',
									value: `${result.ok}ms (${mongooseSeconds}s)`,
									inline: true,
								},
							],
							type: 'editreply',
						},
						ctx,
					);
				});
			});
	},
};
