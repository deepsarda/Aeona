import { CommandOptions, Components, Context } from '@thereallonewolf/amethystframework';
import { Message } from '@discordeno/bot';

import Schema from '../../database/models/family.js';
import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'adopt',
  description: 'Adopt a user',
  commandType: ['application', 'message'],
  category: 'marriage',
  args: [
    {
      name: 'user',
      description: 'The user to adopt',
      required: true,
      type: 'User',
    },
  ],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;
    const target = await ctx.options.getUser('user', true);
    const author = ctx.user;

    if (author.id == target.id)
      return client.extras.errNormal(
        {
          error: 'You cannot adopt yourself',
          type: 'reply',
        },
        ctx,
      );

    if (target.toggles.bot)
      return client.extras.errNormal(
        {
          error: 'You cannot adopt a bot',
          type: 'reply',
        },
        ctx,
      );

    const familyMember = await Schema.findOne({
      User: `${target.id}`,
      Parent: `${author.id}`,
    });
    const familyMember2 = await Schema.findOne({
      User: `${author.id}`,
      Parent: `${target.id}`,
    });
    const familyMember3 = await Schema.findOne({
      User: `${author.id}`,
      Partner: `${target.id}`,
    });

    if (familyMember || familyMember2 || familyMember3) {
      return client.extras.errNormal(
        {
          error: `You cannot adopt a family member!`,
          type: 'reply',
        },
        ctx,
      );
    }

    const checkAdopt = await Schema.findOne({
      Children: `${target.id}`,
    });
    if (checkAdopt) {
      return client.extras.errNormal(
        {
          error: `This user has already been adopted`,
          type: 'reply',
        },
        ctx,
      );
    }

    const row = new Components()
      .addButton('Yes', 'Success', 'adopt_yes', { emoji: '✅' })
      .addButton('No', 'Danger', 'adopt_deny', { emoji: '❌' });

    const message: Message = await client.extras.embed(
      {
        title: `Adoption`,
        desc: `<@${author.id}> has <@${target.id}> asked to adopt them! \n<@${target.id}> click on one of the buttons`,
        components: row,
        content: `<@${target.id}>`,
        type: 'reply',
      },
      ctx,
    );

    const filter = (bot, i) => i.user.id === target.id;
    client.utils
      .awaitComponent(message.id, {
        filter,
        type: 'Button',
      })
      .then(async (i) => {
        if (i.data?.customId == 'adopt_yes') {
          Schema.findOne({ User: `${author.id}` }, async (err: any, data) => {
            if (data) {
              data.Children.push(`${target.id}`);
              data.save();
            } else {
              new Schema({
                User: `${author.id}`,
                Children: `${target.id}`,
              }).save();
            }
          });

          Schema.findOne({ User: `${target.id}` }, async (err: any, data) => {
            if (data) {
              data.Parent.push(`${author.id}`);
              data.save();
            } else {
              new Schema({
                User: `${target.id}`,
                Parent: `${author.id}`,
              }).save();
            }
          });

          client.extras.embed(
            {
              title: `Adoption - Approved`,
              desc: `<@${author.id}> is now the proud parent of <@${target.id}>! 🎉`,
              components: [],
              type: 'reply',
            },
            ctx,
          );
        }

        if (i.data?.customId == 'adopt_deny') {
          client.extras.embed(
            {
              title: `Adoption - Denied`,
              desc: `<@${target.id}> don't want to be adopted by <@${author.id}>`,
              components: [],
              type: 'reply',
            },
            ctx,
          );
        }
      })
      .catch(() => {
        client.extras.embed(
          {
            title: `Adoption - Denied`,
            desc: `<@${target.id}> has not answered anything! The adoption is canceled`,
            components: [],
            type: 'reply',
          },
          ctx,
        );
      });
  },
} as CommandOptions;
