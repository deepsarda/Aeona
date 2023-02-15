import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'perks',
  description: 'See all the perks of premium',
  commandType: ['application', 'message'],
  category: 'info',
  args: [],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;

   

    client.extras.embed(
      {
        title: `:AeonicDevelopment: Aeona Premium`,
        desc:`
With this you get:
• Removes all Aeonic Development Branding
• Access to beta features & news
• Premium Support
• **Hoisted Role**
• **No upvote needed**
• You no longer have to vote to use \`+imagine\`
• Disable A.I NSFW filter
• **Unlocks A.I Auto Mod (Coming Soon)**
• Ability to setup **chatbot** in up to \`8\` channels.
• Ability to setup **starboard** in up to \`8\` channels.
• Ability to setup **boosting and unboosting messages** in up to \`8\` channels.
• Ability to setup up to \`8\` **welcome systems**.
• Ability to setup up to \`8\` **leave systems**.
• Ability to setup up to \`8\` **level messaging systems**.
• Ability to setup **counting** in up to \`8\` channels.
• Ability to setup **guess the number** in up to \`8\` channels.
• Ability to setup **guess the word** in up to \`8\` channels.

You can get premium for just **$2.99** at [https://patreon.com/aeonicdiscord](https://patreon.com/aeonicdiscord) \n **or** \n *boost our [support server](https://www.aeona.xyz/support)*. \n Use \`+perks\` to see all the perks of premium.
`,
      
        type: 'reply',
      },
      ctx,
    );
  },
} as CommandOptions;
