import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import ms from 'ms';

import Schema from '../../database/models/reminder.js';
import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'remind',
  description: 'Set a reminder',
  commandType: ['application', 'message'],
  category: 'tools',
  args: [],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;
    const time = ctx.options.getString('time', true);
    const text = ctx.options.getLongString('message', true);

    const endtime = new Date().getTime() + ms(time);

    Schema.findOne({ Text: text, User: ctx.user.id, endTime: endtime }, async (err, data) => {
      if (data) {
        return client.extras.errNormal(
          { error: `You already made this reminder!`, type: 'reply' },
          ctx,
        );
      }
      return client.extras.succNormal(
        {
          text: `Your reminder is set!`,
          fields: [
            {
              name: `End Time`,
              value: `${new Date(endtime).toLocaleTimeString()}`,
              inline: true,
            },
            {
              name: `Reminder`,
              value: `${text}`,
              inline: true,
            },
          ],
          type: 'reply',
        },
        ctx,
      );
    });

    setTimeout(async () => {
      const channel = await client.helpers.getDmChannel(ctx.author!.id);
      client.extras.embed(
        {
          title: `Reminder`,
          desc: `Your reminder just ended!`,
          fields: [
            {
              name: `Reminder`,
              value: `${text}`,
              inline: true,
            },
          ],
        },
        channel,
      );

      await Schema.findOneAndDelete({
        Text: text,
        User: ctx.user?.id,
        endTime: endtime,
      });
    }, endtime - new Date().getTime());
  },
} as CommandOptions;
