import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'bassboost',
	description: 'Enable bassboost ',
	commandType: ['application', 'message'],
	category: 'music',
	args: [
		{
			name: 'level',
			description: 'The level of bass',
			required: true,
			type: 'String',
			choices: [
				{
					name: '0',
					value: '0',
				},
				{
					name: '1',
					value: '1',
				},
				{
					name: '2',
					value: '2',
				},
				{
					name: '3',
					value: '3',
				},
			],
		},
	],

	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel || !ctx.member)
			return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		const level = ctx.options.getString('level', true);

		const levels = {
			0: 0.0,
			1: 0.5,
			2: 1.0,
			3: 2.0,
		};

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

		const bands = new Array(3).fill(null).map((_, i) => ({ band: i, gain: levels[level!] }));

		player.setEQ(...bands);

		client.extras.succNormal(
			{
				text: `Bass boost level adjusted to **level ${level}**`,
				type: 'reply',
			},
			ctx,
		);
	},
} as CommandOptions;
