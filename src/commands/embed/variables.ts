import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'variables',
  description: 'See all the variables you can use in my embeds.',
  commandType: ['application', 'message'],
  category: 'embed',
  args: [
  ],
  userGuildPermissions: ['MANAGE_MESSAGES'],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;
    client.extras.embed(
      {
        title: `Variables for you to use.`,
        desc: `
        <:ayyy:1056627813286952980> **User Variables**
         __Variable <:F_Arrow:1049291677359153202> Description <:F_Arrow:1049291677359153202> 
         \`{user:username}\` <:F_Arrow:1049291677359153202> User's Name 
         \`{user:discriminator}\` <:F_Arrow:1049291677359153202> User's Discriminator
         \`{user:tag}\` <:F_Arrow:1049291677359153202> User's Tag
         \`{user:mention}\` <:F_Arrow:1049291677359153202> User ping
         \`{user:invites}\` <:F_Arrow:1049291677359153202> Number of users invited
         \`{user:invites:left}\` <:F_Arrow:1049291677359153202> Number of users left after inviting
         \`{user:level}\` <:F_Arrow:1049291677359153202> User's level
         \`{user:xp}\` <:F_Arrow:1049291677359153202> User's xp
         \`{user:rank}\` <:F_Arrow:1049291677359153202> User's rank
         \`{user:avatar}\` <:F_Arrow:1049291677359153202> Link to user's avatar
       <:YaeSmug:1062031989714198678> **Inviter Variables** *The user who invited the user*
         \`{inviter:username}\` <:F_Arrow:1049291677359153202> User's Name 
         \`{inviter:discriminator}\` <:F_Arrow:1049291677359153202> User's Discriminator
         \`{inviter:tag}\` <:F_Arrow:1049291677359153202> User's Tag
         \`{inviter:mention}\` <:F_Arrow:1049291677359153202> User ping
         \`{inviter:invites}\` <:F_Arrow:1049291677359153202> Number of users invited
         \`{inviter:invites:left}\` <:F_Arrow:1049291677359153202> Number of users left after inviting
         \`{inviter:level}\` <:F_Arrow:1049291677359153202> User's level
         \`{inviter:xp}\` <:F_Arrow:1049291677359153202> User's xp
         \`{inviter:rank}\` <:F_Arrow:1049291677359153202> User's rank
         \`{inviter:avatar}\` <:F_Arrow:1049291677359153202> Link to user's avatar
       <:AH_LoveCat:1050681792060985414> **Server Variables**
         \`{guild:name}\` <:F_Arrow:1049291677359153202> Server's Name
         \`{guild:owner}\` <:F_Arrow:1049291677359153202> Ping to the server's owner
         \`{guild:members}\` <:F_Arrow:1049291677359153202> Number of users in this server.
         \`{guild:tier}\` <:F_Arrow:1049291677359153202> Server's boosting tier
         \`{guild:description}\` <:F_Arrow:1049291677359153202> Server's description
         \`{guild:boosts}\` <:F_Arrow:1049291677359153202>The number of boosts this server has
         \`{guild:rules}\` <:F_Arrow:1049291677359153202> The ping of the channel setup for rules
         \`{guild:icon}\` <:F_Arrow:1049291677359153202> Link to server's icon
         \`{guild:banner}\` <:F_Arrow:1049291677359153202> Link to server's banner


         **Remove remove this click on \`Set/Delete Description\` and then send \`cancel\`.**
        `,
      },
      ctx,
    );
  },
} as CommandOptions;
