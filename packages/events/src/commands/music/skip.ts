import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'skip',
  description: 'Skip this song.',
  commandType: ['application', 'message'],
  category: 'music',
  args: [],

  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel || !ctx.member) return;

    const player = client.extras.player.players.get(`${ctx.guildId}`);

    if (!client.extras.voiceStates.get(`${ctx.guildId}_${ctx.user.id}`))
      return client.extras.errNormal(
        {
          error: `You're not in a voice channel!`,
          type: 'reply',
        },
        ctx,
      );

    if (
      player &&
      client.extras.voiceStates.get(`${ctx.guildId}_${ctx.user.id}`)
        ?.channelId +
        '' !==
        player?.voiceChannel
    )
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

    player.stop();

    client.extras.succNormal(
      {
        text: `Skipped the music!`,
        type: 'reply',
      },
      ctx,
    );
  },
} as CommandOptions;
