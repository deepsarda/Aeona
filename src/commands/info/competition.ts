import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'competition',
  description: 'Get information about my competition',
  commandType: ['application', 'message'],
  category: 'info',
  args: [],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;

    client.extras.embed(
      {
        title: `My Competition!`,
        desc: `Oh, Hi there. <:kanna_wave:1053256324084928562>
    
    **What is this competition?**
    We would love to hear how you are using Aeona in your amazing community at the same time engaging with you. So our team came up with the idea of this competition. 
    The idea is simple, join our [support server](https://www.aeona.xyz/support) and follow the guidelines in <#1093206604574372001>.

    The winner will be announced on 14 may, 2023.

    **Rules**
    The competition is open to everyone, but the post must feature Aeona in some way. 
    You have to follow discord terms of server, and the rules in <#1034419695060791339>

    **How to submit your entry**
    You can post upto 1 entry every 6 hours. You have to set a title and then attach the image. The image must be in jpg, png, gif, or webp format. Also choose a tag that best describes your post.
   
    **Prize**
    The winner will win one month of Discord Nitro! `,
        type: 'reply',
      },
      ctx,
    );
  },
} as CommandOptions;
