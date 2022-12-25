import util from 'util';

import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { AeonaBot } from '../../extras/index.js';
export default {
    name: 'eval',
    description: 'Run some code',
    commandType: ['application', 'message'],
    category: 'owner',
    args: [{
        name: 'code',
        type: 'String',
        required: true,
    }],
    ownerOnly: true,
    async execute(client: AeonaBot, ctx: Context) {
        if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
        const code = ctx.options.getLongString('code', true);
        let embed = ``;
        try {
            let output = eval(code);
            if (typeof output !== 'string') output = util.inspect(output, { depth: 0 });

            embed = `\`\`\`js\n${output.length > 1024 ? 'Too large to display.' : output}\`\`\``

        } catch (err) {
            embed = `\`\`\`js\n${err.length > 1024 ? 'Too large to display.' : err}\`\`\``
        }

        client.extras.succNormal({
            text: embed,
            type: "reply",
        }, ctx);


    },
} as CommandOptions;
