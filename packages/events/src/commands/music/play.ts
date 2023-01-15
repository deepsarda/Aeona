import { CommandOptions, Components, Context } from '@thereallonewolf/amethystframework';
import { Interaction } from 'discordeno/transformers';
import { ChannelTypes } from 'discordeno/types';

import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'play',
  description: 'Play some music',
  commandType: ['application', 'message'],
  category: 'music',
  args: [
    {
      name: 'song',
      description: 'The song to play',
      required: true,
      type: 'String',
    },
  ],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel || !ctx.member) return;

    const song = ctx.options.getLongString('song', true);

    if (!client.extras.voiceStates.get(`${ctx.guildId}_${ctx.user.id}`))
      return client.extras.errNormal(
        {
          error: `You're not in a voice channel!`,
          type: 'reply',
        },
        ctx,
      );

    const channel = await client.helpers.getChannel(
      client.extras.voiceStates.get(`${ctx.guildId}_${ctx.user.id}`)?.channelId!,
    );

    let player = client.extras.player.players.get(`${ctx.guild.id}`);

    if (player && `${channel.id}` !== player?.voiceChannel)
      return client.extras.errNormal(
        {
          error: `You are not in the same voice channel!`,
          type: 'reply',
        },
        ctx,
      );

    if (!player) {
      player = client.extras.player.create({
        guild: `${ctx.guild.id}`,
        voiceChannel: `${channel.id}`,
        textChannel: `${ctx.channel.id}`,
        selfDeafen: true,
      });

      player.connect();

      setTimeout(() => {
        if (channel.type == ChannelTypes.GuildStageVoice) {
          client.helpers.updateBotVoiceState(ctx.guildId!, {
            channelId: channel.id,
            suppress: false,
          });
        }
      }, 500);
    }

    player = client.extras.player.players.get(`${ctx.guild.id}`)!;
    if (player.state !== 'CONNECTED') player.connect();

    client.extras.simpleEmbed(
      {
        desc: `🔎 Searching...`,
        type: 'reply',
      },
      ctx,
    );

    const res = await player.search(song, `<@${ctx.user.id}>`);

    if (res.loadType === 'LOAD_FAILED') {
      if (!player.queue.current) player.destroy();
      return client.extras.errNormal(
        {
          error: `Error getting music. Please try again in a few minutes`,
          type: 'reply',
        },
        ctx,
      );
    }

    switch (res.loadType) {
      case 'NO_MATCHES': {
        if (!player.queue.current) player.destroy();
        await client.extras.errNormal(
          {
            error: `No music was found`,
            type: 'reply',
          },
          ctx,
        );
        break;
      }

      case 'TRACK_LOADED': {
        const track = res.tracks[0];
        await player.queue.add(track);

        if (!player.playing && !player.paused) {
          player.play();
        } else {
          client.extras.embed(
            {
              title: `<:Pink_music:1062773191107416094> ${track.title}`,
              url: track.uri,
              desc: `The song has been added to the queue!`,
              thumbnail: track.thumbnail!,
              fields: [
                {
                  name: `👤 Requested By`,
                  value: `${track.requester}`,
                  inline: true,
                },
                {
                  name: `🕒 Ends at`,
                  value: `<t:${(Date.now() / 1000 + track.duration / 1000).toFixed(0)}:f>`,
                  inline: true,
                },
                {
                  name: `🎬 Author`,
                  value: `${track.author}`,
                  inline: true,
                },
              ],
              type: 'reply',
            },
            ctx,
          );
        }
        break;
      }

      case 'PLAYLIST_LOADED': {
        await player.queue.add(res.tracks);
        if (!player.playing && !player.paused) player.play();

        break;
      }

      case 'SEARCH_RESULT': {
        let max = 5;

        if (res.tracks.length < max) max = res.tracks.length;
        const components = new Components();
        components.addButton('', 'Secondary', '1', { emoji: '1️⃣' });
        components.addButton('', 'Secondary', '2', { emoji: '2️⃣' });
        components.addButton('', 'Secondary', '3', { emoji: '3️⃣' });
        components.addButton('', 'Secondary', '4', { emoji: '4️⃣' });
        components.addButton('', 'Secondary', '5', { emoji: '5️⃣' });
        components.addButton('', 'Danger', 'cancel', { emoji: '🛑' });

        const results = res.tracks
          .slice(0, max)
          .map(
            (track, index) =>
              `**[#${++index}]** ${
                track.title.length >= 45 ? `${track.title.slice(0, 45)}...` : track.title
              }`,
          )
          .join('\n');

        const message = await client.extras.embed(
          {
            title: `🔍・Search Results`,
            desc: results,
            fields: [
              {
                name: `❓ Cancel search?`,
                value: `Press \`cancel\` to stop the search`,
                inline: true,
              },
            ],
            components,
            type: 'reply',
          },
          ctx,
        );
        let i: Interaction | undefined;
        try {
          i = await client.amethystUtils.awaitComponent(message.id, {
            filter: (bot, i) => i.user.id === ctx.user!.id,
            timeout: 30e3,
            maxUsage: 1,
            type: 'Button',
          });
        } catch (e) {
          if (!player.queue.current) player.destroy();
          return client.extras.errNormal(
            {
              error: `You didn't provide a selection`,
              type: 'reply',
            },
            ctx,
          );
        }

        const first = i!.data?.customId!;

        if (first.toLowerCase() === 'cancel') {
          if (!player.queue.current) player.destroy();
          return ctx.reply({ content: 'Cancelled.' });
        }

        const index = Number(first) - 1;
        if (index < 0 || index > max - 1)
          return client.extras.errNormal(
            {
              error: `The number you provided too small or too big (1-${max})`,
              type: 'reply',
            },
            ctx,
          );

        const track = res.tracks[index];
        player.queue.add(track);

        if (!player.playing && !player.paused) {
          player.play();
        } else {
          client.extras.embed(
            {
              title: `<:Pink_music:1062773191107416094> ${track.title}`,
              url: track.uri,
              desc: `The song has been added to the queue!`,
              thumbnail: track.thumbnail!,
              fields: [
                {
                  name: `👤 Requested By`,
                  value: `${track.requester}`,
                  inline: true,
                },
                {
                  name: `🕒 Ends at`,
                  value: `<t:${(Date.now() / 1000 + track.duration / 1000).toFixed(0)}:f>`,
                  inline: true,
                },
                {
                  name: `🎬 Author`,
                  value: `${track.author}`,
                  inline: true,
                },
              ],
              type: 'reply',
            },
            ctx,
          );
        }
      }
    }
  },
} as CommandOptions;
