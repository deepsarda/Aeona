import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import { AeonaBot } from '../../extras/index.js';

export default {
  name: '8ball',
  description: 'use the 8ball',
  commandType: ['application', 'message'],
  category: 'game',
  args: [
    {
      name: 'question',
      description: 'the question you want to ask',
      required: true,
      type: 'String',
    },
  ],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;
    const question = ctx.options.getString('question', true);

    const antwoorden = [
      'Yes!',
      'Unfortunately not',
      'You are absolutely right!',
      'No, sorry.',
      'I agree',
      'No idea!',
      'I am not that smart ..',
      'My sources say no!',
      'It is certain',
      'You can rely on it',
      'Probably not',
      'Everything points to a no',
      'No doubt',
      'Absolutely',
      'I do not know',
    ];
    const resultaat = Math.floor(Math.random() * antwoorden.length);

    client.extras.embed(
      {
        title: `8ball`,
        desc: `See the answer on your question!`,
        fields: [
          {
            name: `💬 Your Question`,
            value: `\`\`\`${question}\`\`\``,
            inline: false,
          },
          {
            name: `💬 Bot Answer`,
            value: `\`\`\`${antwoorden[resultaat]}\`\`\``,
            inline: false,
          },
        ],
        type: 'reply',
      },
      ctx,
    );
  },
} as CommandOptions;
