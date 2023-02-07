import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'variables',
  description: 'See all the variables you can use in my embeds.',
  commandType: ['application', 'message'],
  category: 'embed',
  args: [
    {
      name: 'channel',
      description: 'Channel in which the message is in.',
      required: true,
      type: 'Channel',
    },
  ],
  userGuildPermissions: ['MANAGE_MESSAGES'],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;
    client.extras.embed(
      {
        title: `Variables for you to use.`,
        desc: `
        <:ayyy:1056627813286952980> **User Variables**
         __Variable <:F_Arrow:1049291677359153202> Description <:F_Arrow:1049291677359153202> Example__
         \`{user:username}\` <:F_Arrow:1049291677359153202> User's Name <:F_Arrow:1049291677359153202> {user:username}
         \`{user:discriminator}\` <:F_Arrow:1049291677359153202> User's Discriminator<:F_Arrow:1049291677359153202> {user:discriminator}
         \`{user:tag}\` <:F_Arrow:1049291677359153202> User's Tag<:F_Arrow:1049291677359153202> {user:tag}
         \`{user:mention}\` <:F_Arrow:1049291677359153202> User ping<:F_Arrow:1049291677359153202> {user:mention}
         \`{user:invites}\` <:F_Arrow:1049291677359153202> Number of users invited<:F_Arrow:1049291677359153202> {user:invites}
         \`{user:invites:left}\` <:F_Arrow:1049291677359153202> Number of users left after inviting <:F_Arrow:1049291677359153202> {user:invites:left}
         \`{user:level}\` <:F_Arrow:1049291677359153202> User's level<:F_Arrow:1049291677359153202> {user:level}
         \`{user:xp}\` <:F_Arrow:1049291677359153202> User's xp <:F_Arrow:1049291677359153202> {user:xp}
         \`{user:rank}\` <:F_Arrow:1049291677359153202> User's rank<:F_Arrow:1049291677359153202> {user:rank}
         \`{user:avatar}\` <:F_Arrow:1049291677359153202> Link to user's avatar
       <:YaeSmug:1062031989714198678> **Inviter Variables** *The user who invited the user*
         \`{inviter:username}\` <:F_Arrow:1049291677359153202> User's Name <:F_Arrow:1049291677359153202> {inviter:username}
         \`{inviter:discriminator}\` <:F_Arrow:1049291677359153202> User's Discriminator<:F_Arrow:1049291677359153202> {inviter:discriminator}
         \`{inviter:tag}\` <:F_Arrow:1049291677359153202> User's Tag <:F_Arrow:1049291677359153202> {inviter:tag}
         \`{inviter:mention}\` <:F_Arrow:1049291677359153202> User ping<:F_Arrow:1049291677359153202> {inviter:mention}
         \`{inviter:invites}\` <:F_Arrow:1049291677359153202> Number of users invited<:F_Arrow:1049291677359153202> {inviter:invites}
         \`{inviter:invites:left}\` <:F_Arrow:1049291677359153202> Number of users left after inviting <:F_Arrow:1049291677359153202> {inviter:invites:left}
         \`{inviter:level}\` <:F_Arrow:1049291677359153202> User's level <:F_Arrow:1049291677359153202> {inviter:level}
         \`{inviter:xp}\` <:F_Arrow:1049291677359153202> User's xp <:F_Arrow:1049291677359153202> {inviter:xp}
         \`{inviter:rank}\` <:F_Arrow:1049291677359153202> User's rank<:F_Arrow:1049291677359153202> {inviter:rank}
         \`{inviter:avatar}\` <:F_Arrow:1049291677359153202> Link to user's avatar
       <:AH_LoveCat:1050681792060985414> **Server Variables**
         \`{guild:name}\` <:F_Arrow:1049291677359153202> Server's Name <:F_Arrow:1049291677359153202> {guild:name}
         \`{guild:owner}\` <:F_Arrow:1049291677359153202> Ping to the server's owner <:F_Arrow:1049291677359153202> {guild:owner}
         \`{guild:members}\` <:F_Arrow:1049291677359153202> Number of users in this server.
         \`{guild:tier}\` <:F_Arrow:1049291677359153202> Server's boosting tier <:F_Arrow:1049291677359153202> {guild:tier}
         \`{guild:description}\` <:F_Arrow:1049291677359153202> Server's description <:F_Arrow:1049291677359153202> {guild:description}
         \`{guild:boosts}\` <:F_Arrow:1049291677359153202>The number of boosts this server has <:F_Arrow:1049291677359153202>3 {guild:boosts}
         \`{guild:rules}\` <:F_Arrow:1049291677359153202> The ping of the channel setup for rules <:F_Arrow:1049291677359153202> {guild:rules}
         \`{guild:icon}\` <:F_Arrow:1049291677359153202> Link to server's icon
         \`{guild:banner}\` <:F_Arrow:1049291677359153202> Link to server's banner


         **Remove remove this click on \`Set/Delete Description\` and then send \`cancel\`.**
        `,
      },
      ctx,
    );
  },
} as CommandOptions;
