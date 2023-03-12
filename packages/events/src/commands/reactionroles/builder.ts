import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import Schema from '../../database/models/reactionRoles.js';
import { AeonaBot } from '../../extras/index.js';

export default {
    name: 'builder',
    description: 'Create a reactionrole',
    commandType: ['application', 'message'],
    category: 'reactionroles',
    args: [
        {
            name: 'name',
            description: 'The name for the reaction role',
            required: true,
            type: 'String',
        },
    ],
    userGuildPermissions: ['MANAGE_ROLES'],
    async execute(client: AeonaBot, ctx: Context) {
        if (!ctx.guild || !ctx.user || !ctx.channel) return;

        const name = ctx.options.getString('name', true);



        let schema = await Schema.findOne({ Guild: ctx.guild!.id, Category: name });
        if (!schema) {
            schema = new Schema({
                Guild: ctx.guild!.id,
                Message: 0,
                Category: category,
                Roles: {
                    [emoji]: [
                        `${role.id}`,
                        {
                            id: `${parsedEmoji.id}`,
                            raw: emoji,
                        },
                    ],
                },
            });

            schema.save();
        }



    }
} as CommandOptions;
function parseEmoji(text: string) {
    if (text.includes('%')) text = decodeURIComponent(text);
    if (!text.includes(':'))
        return {
            name: text,
            id: undefined,

            animated: true,
            requireColons: true,
        };
    const match = text.match(/<?(?:(a):)?(\w{2,32}):(\d{17,19})?>?/);
    return match && { animated: Boolean(match[1]), name: match[2], id: match[3] };
}
