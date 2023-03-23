import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import voucher_codes from 'voucher-code-generator';

import Premium from '../../database/models/premium.js';
import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'createliftetime',
  description: 'Create premium codes',
  commandType: ['application', 'message'],
  category: 'owner',
  args: [],
  ownerOnly: true,
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;

    const expiresAt = Date.now() + 2592000000 * 999;
    const array: string[] = [];

    const codePremium = voucher_codes.generate({
      pattern: '####-####-####',
    });

    const c = codePremium.toString().toUpperCase();

    Premium.create({
      code: c,
      expiresAt,
      plan: 'lifetime',
    });

    array.push(` ${c}`);

    client.extras.succNormal(
      {
        text: array.join('\n'),
        type: 'reply',
      },
      ctx,
    );
  },
} as CommandOptions;
