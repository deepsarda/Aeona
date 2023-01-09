import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'queue',
	description: 'See the queue',
	commandType: ['application', 'message'],
	category: 'music',
	args: [],

	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel || !ctx.member)
			return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);

		const player = client.extras.player.players.get(ctx.guildId + '');

		if (!client.extras.voiceStates.get(ctx.guildId + '_' + ctx.user.id))
			return client.extras.errNormal(
				{
					error: `You're not in a voice channel!`,
					type: 'reply',
				},
				ctx,
			);

		const channel = await client.helpers.getChannel(
			client.extras.voiceStates.get(ctx.guildId + '_' + ctx.user.id)?.channelId!,
		);

		if (player && channel.id + '' !== player?.voiceChannel)
			return client.extras.errNormal(
				{
					error: `You're not in the same voice channel!`,
					type: 'reply',
				},
				ctx,
			);

		if (!player || !player.queue.current)
			return client.extras.errNormal(
				{
					error: 'There are no songs playing in this server',
					type: 'reply',
				},
				ctx,
			);

		let count = 0;
		let status;

		if (player.queue.length == 0) {
			status = 'No more music in the queue';
		} else {
			status = player.queue
				.map((track) => {
					count += 1;
					return `**[#${count}]**┆${
						track.title.length >= 45 ? `${track.title.slice(0, 45)}...` : track.title
					} (Requested by ${track.requester})`;
				})
				.join('\n');
		}
		let thumbnail;
		if (player.queue.current.thumbnail) thumbnail = player.queue.current.thumbnail;

		client.extras.embed(
			{
				title: `Songs queue - ${ctx.guild.name}`,
				desc: status,
				thumbnail: thumbnail,
				fields: [
					{
						name: ` Current song:`,
						value: `${player.queue.current.title} (Requested by ${player.queue.current.requester})`,
					},
				],
				type: 'reply',
			},
			ctx,
		);
	},
} as CommandOptions;
