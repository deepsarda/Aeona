import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import lyricsFinder from 'lyrics-finder';

import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'lyrics',
	description: 'Get current lyrics information',
	commandType: ['application', 'message'],
	category: 'music',
	args: [],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel || !ctx.member)
			return;

		const player = client.extras.player.players.get(ctx.guildId + '');
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

		let lyrics = '';

		try {
			lyrics = await lyricsFinder(player.queue.current.title, '');
			if (!lyrics) lyrics = `No lyrics found for ${player.queue.current.title} :x:`;
		} catch (error) {
			lyrics = `No lyrics found for ${player.queue.current.title} :x:`;
		}

		client.extras.embed(
			{
				title: `<:Pink_music:1062773191107416094> Lyrics For ${player.queue.current.title}`,
				desc: lyrics,
				type: 'reply',
			},
			ctx,
		);
	},
} as CommandOptions;
