import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'playing',
	description: 'See the currently playing song.',
	commandType: ['application', 'message'],
	category: 'music',
	args: [],
	userGuildPermissions: ['MANAGE_MESSAGES'],
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

		const musicLength = player.queue.current.isStream
			? null
			: !player.queue.current || !player.queue.current.duration || isNaN(player.queue.current.duration)
			? null
			: player.queue.current.duration;
		const nowTime = !player.position || isNaN(player.position) ? null : player.position;

		const bar = await createProgressBar(musicLength, nowTime);

		client.extras.embed(
			{
				title: `${player.queue.current.title}`,
				url: player.queue.current.uri,
				thumbnail: player.queue.current?.thumbnail ? player.queue.current?.thumbnail : '',
				fields: [
					{
						name: `👤Requested By`,
						value: `${player.queue.current.requester}`,
						inline: true,
					},
					{
						name: `Duration`,
						value: `<t:${(Date.now() / 1000 + player.queue.current.duration! / 1000 - nowTime! / 1000).toFixed(0)}:f>`,
						inline: true,
					},
					{
						name: `$Volume`,
						value: `${player.volume}%`,
						inline: true,
					},
					{
						name: `Progress`,
						value:
							`${new Date(player.position).toISOString().slice(11, 19)} ┃ ` +
							bar +
							` ┃ ${new Date(player.queue.current.duration!).toISOString().slice(11, 19)}`,
						inline: false,
					},
				],
				type: 'reply',
			},
			ctx,
		);
	},
} as CommandOptions;

async function createProgressBar(total, current, size = 10, line = '▬', slider = '🔘') {
	if (current > total) {
		const bar = line.repeat(size + 2);
		const percentage = (current / total) * 100;
		return [bar, percentage];
	} else {
		const percentage = current / total;
		const progress = Math.round(size * percentage);

		if (progress > 1 && progress < 10) {
			const emptyProgress = size - progress;
			const progressText = line.repeat(progress).replace(/.$/, slider);
			const emptyProgressText = line.repeat(emptyProgress);
			const bar = progressText + emptyProgressText;
			return [bar];
		} else if (progress < 1 || progress == 1) {
			const emptyProgressText = line.repeat(9);
			const bar = '🔘' + emptyProgressText;
			return [bar];
		} else if (progress > 10 || progress == 10) {
			const emptyProgressText = line.repeat(9);
			const bar = emptyProgressText + '🔘';
			return [bar];
		}
	}
}
