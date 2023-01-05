import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'loop',
	description: 'Loop the current song ',
	commandType: ['application', 'message'],
	category: 'music',
	args: [],
	userGuildPermissions: ['MANAGE_MESSAGES'],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel || !ctx.member)
			return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);

		if (!client.extras.voiceStates.get(ctx.guildId + '_' + ctx.user.id))
			return client.extras.errNormal(
				{
					error: `You're not in a voice channel!`,
					type: 'reply',
				},
				ctx,
			);
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

		player.setTrackRepeat(!player.trackRepeat);
		const trackRepeat = player.trackRepeat ? 'enabled' : 'disabled';

		client.extras.succNormal(
			{
				text: `Loop is **${trackRepeat}** for the current song`,
				type: 'reply',
			},
			ctx,
		);
	},
} as CommandOptions;
