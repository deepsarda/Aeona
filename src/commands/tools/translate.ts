import translate from '@iamtraction/google-translate';
import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'translate',
  description: 'Translate text to another language',
  commandType: ['application', 'message'],
  category: 'tools',
  args: [
    {
      name: 'language',
      type: 'String',
      description: 'The language to translate text to',
      required: true,
    },
    {
      name: 'text',
      type: 'String',
      description: 'The text to translate text to',
      required: true,
    },
  ],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;
    const language = ctx.options.getString('language', true);
    const text = ctx.options.getLongString('text', true);

    translate(text, { to: language })
      .then((res) => {
        client.extras.embed(
          {
            title: `${client.extras.emotes.normal.check} Success!`,
            desc: `I have translated the following`,
            fields: [
              {
                name: '📥 - Input',
                value: `${text}`,
                inline: false,
              },
              {
                name: '📤 - Output',
                value: `${res.text}`,
                inline: false,
              },
            ],
            type: 'reply',
          },
          ctx,
        );
      })
      .catch((_err) => {
        client.extras.errNormal(
          {
            error: 'Please provide a valid ISO language code!',
            type: 'reply',
          },
          ctx,
        );
      });
  },
} as CommandOptions;
