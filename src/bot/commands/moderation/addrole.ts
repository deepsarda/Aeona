import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import { AeonaBot } from '../../extras/index.js';

export default {
    name: 'ban',
    description: 'Ban a user.',
    commandType: ['application', 'message'],
    category: 'moderation',
    args: [
        {
            name: 'user',
            description: 'The user to give role too.',
            required: true,
            type: 'User',
        },
        {
            name: 'role',
            description: 'The role to be given to the user',
            required: false,
            type: 'Role',
        },
        {
            name: 'reason',
            description: 'The reason for the ban.',
            required: false,
            type: 'String',
        },
    ],
    userGuildPermissions: ['MODERATE_MEMBERS'],
    async execute(client: AeonaBot, ctx: Context) {
        if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
        const user = await ctx.options.getUser('user', true);

        const role = await ctx.options.getRole('role', true);
        const reason = ctx.options.getString('reason') || `Not given`;

        client.helpers.addRole(ctx.guild.id, user.id, role.id, reason).then(() =>
            client.extras.succNormal({
                text: `I have successfully added the role to that user.`
            }, ctx)
        ).catch(() => client.extras.errNormal({
            error: `I was unable to add the role to that user. Please check that the user does not already have that role and I have premissions to give it to them.`,
        }, ctx));

    },
} as CommandOptions;
