import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { avatarUrl } from '@discordeno/bot';
import { AeonaBot } from '../../extras/index.js';
import wrapper from '../../lib/popcat.js';

export default {
  name: 'ship',
  description: 'Roast a user.',
  commandType: ['application', 'message'],
  category: 'fun',
  args: [
    {
      name: 'user',
      description: 'The user',
      required: true,
      type: 'User',
    },
    {
      name: 'user2',
      description: 'The user',
      required: false,
      type: 'User',
    },
  ],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;
    const user = await ctx.options.getUser('user', true);
    const user2 = (await ctx.options.getUser('user2', false)) ?? ctx.user;

    const url = await wrapper.ship(
      avatarUrl(user.id, user.discriminator, {
        avatar: user.avatar,
        format: 'png',
      }),
      avatarUrl(user2.id, user2.discriminator, {
        avatar: user.avatar,
        format: 'png',
      }),
    );

    client.extras.embed(
      {
        title: `${user.username}x${user2.username}`,
        image: url,
      },
      ctx,
    );
  },
} as CommandOptions;
