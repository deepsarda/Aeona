import { Components } from '@thereallonewolf/amethystframework';
import colors from 'colors';

import { AeonaBot } from '../extras/index.js';

export default function (bot: AeonaBot) {
  console.log('Setting up '.cyan + 'music'.yellow);
  bot.extras.player.on('nodeConnect', () =>
    console.log('Lavalink is connected.'.green),
  );
  bot.extras.player.on('nodeError', (node, error) =>
    console.log(
      colors.red(colors.bold(`ERROR`)),
      colors.white(`>>`),
      colors.white(`Node`),
      colors.red(`${node.options.identifier}`),
      colors.white(`had an error:`),
      colors.red(`${error.message}`),
    ),
  );
  bot.extras.player.on('playerDisconnect', async (player, _track) => {
    player.destroy();

    const channel = await bot.cache.channels.get(BigInt(player.textChannel!));
    bot.extras.errNormal(
      {
        error: "Music has stopped. I'm disconnected from the channel",
      },
      channel!,
    );
  });
  bot.extras.player.on(
    'playerMove',
    async (player, currentChannel, newChannel) => {
      if (!newChannel) {
        player.destroy();

        const channel = await bot.cache.channels.get(
          BigInt(player.textChannel!),
        );
        bot.extras.errNormal(
          {
            error: "Music has stopped. I'm disconnected from the channel",
          },
          channel!,
        );
      } else {
        player.set('moved', true);
        player.setVoiceChannel(newChannel);
        if (player.paused) return;
        setTimeout(() => {
          player.pause(true);
          setTimeout(() => player.pause(false), 1000 * 2);
        }, 1000 * 2);
      }
    },
  );
  bot.extras.player.on('queueEnd', async (player, _track) => {
    player.destroy(true);

    const channel = await bot.cache.channels.get(BigInt(player.textChannel!))!;
    bot.extras.errNormal(
      {
        error: 'Queue is empty, Leaving voice channel',
      },
      channel!,
    );
  });
  bot.extras.player.on('trackStart', async (player, track) => {
    const components = new Components();
    components.addButton('', 'Secondary', 'musicprev', {
      emoji: '<:previous:1060474160163328000>',
    });
    components.addButton('', 'Secondary', 'musicpause', {
      emoji: '<:pause:1060473490744029184>',
    });
    components.addButton('', 'Secondary', 'musicstop', {
      emoji: '🛑',
    });
    components.addButton('', 'Secondary', 'musicnext', {
      emoji: '<:next:1060474589349683270>',
    });

    const channel = await bot.cache.channels.get(BigInt(player.textChannel!));

    bot.extras.embed(
      {
        title: `<:Pink_music:1062773191107416094> ${track.title}`,
        url: track.uri,
        desc: `Music started in <#${player.voiceChannel}>!`,
        thumbnail: track.thumbnail!,
        fields: [
          {
            name: `👤 Requested By`,
            value: `${track.requester}`,
            inline: true,
          },
          {
            name: `🕒 Ends at`,
            value: `<t:${(Date.now() / 1000 + track.duration / 1000).toFixed(
              0,
            )}:f> `,
            inline: true,
          },
          {
            name: `🎬 Author`,
            value: `${track.author}`,
            inline: true,
          },
        ],
        components,
      },
      channel!,
    );
  });

  console.log('Finished setting up '.cyan + 'music'.yellow);
}
