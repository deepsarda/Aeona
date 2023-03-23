import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'stealemojies',
  description: 'Generate a chat message',
  commandType: ['application', 'message'],
  category: 'info',
  args: [
    {
      name: 'emoji',
      description: 'The emojies you want to steal with a space in between',
      required: true,
      type: 'String',
    },
  ],
  userGuildPermissions: ['MANAGE_EMOJIS_AND_STICKERS'],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;

    const rawEmoji = ctx.options.getLongString('emoji', true).split(' ');
    for (let i = 0; i < rawEmoji.length; i++) {
      const parsedEmoji = parseEmoji(rawEmoji[i]);
      if (!parsedEmoji) return;
      if (parsedEmoji.id) {
        const extension = parsedEmoji.animated ? '.gif' : '.png';
        const url = `https://cdn.discordapp.com/emojis/${parsedEmoji.id + extension}`;
        client.helpers
          .createEmoji(`${ctx.guild!.id}`, { name: parsedEmoji.name, image: url })
          .then((emoji) => {
            client.extras.succNormal(
              {
                text: `Emoji successfully added to the server`,
                fields: [
                  {
                    name: 'Emoji',
                    value: `<${parsedEmoji.animated ? 'a:' : ':'}${parsedEmoji.name}:${
                      parsedEmoji.id
                    }>`,
                    inline: true,
                  },
                  {
                    name: 'Emoji name',
                    value: `${emoji.name}`,
                    inline: true,
                  },
                  {
                    name: 'Emoji id',
                    value: `${emoji.id}`,
                    inline: true,
                  },
                  {
                    name: `Usage`,
                    value: `\`<${parsedEmoji.animated ? 'a:' : ':'}${parsedEmoji.name}:${
                      parsedEmoji.id
                    }>\``,
                    inline: true,
                  },
                ],
                type: 'reply',
              },
              ctx,
            );
          });
      } else {
        client.extras.errNormal(
          {
            error: 'Emoji not found!',
            type: 'reply',
          },
          ctx,
        );
      }
    }
  },
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
