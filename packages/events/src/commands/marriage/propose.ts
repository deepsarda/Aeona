import { CommandOptions, Components, Context } from '@thereallonewolf/amethystframework';

import Schema from '../../database/models/family.js';
import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'propose',
  description: 'Propose to a user',
  commandType: ['application', 'message'],
  category: 'marriage',
  args: [
    {
      name: 'user',
      description: 'The user to propose',
      required: true,
      type: 'User',
    },
  ],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;
    const target = await ctx.options.getUser('user', true);
    const author = ctx.user;

    if (author.id == target.id)
      return client.extras.errNormal({ error: 'You cannot marry yourself!', type: 'edit' }, ctx);

    Schema.findOne({ Partner: `${author.id}` }, async (err: any, data: any) => {
      if (data) {
        client.extras.errNormal(
          {
            error: 'Someone in the couple is already married!',
            type: 'reply',
          },
          ctx,
        );
      } else {
        Schema.findOne({ Partner: `${target.id}` }, async (err: any, data: any) => {
          if (data) {
            client.extras.errNormal(
              {
                error: 'Someone in the couple is already married!',
                type: 'reply',
              },
              ctx,
            );
          } else {
            Schema.findOne(
              {
                User: `${target.id}`,
                Parent: `${author.id}`,
              },
              async (err: any, data: any) => {
                if (data) {
                  client.extras.errNormal(
                    {
                      error: 'You cannot marry a family member!',
                      type: 'reply',
                    },
                    ctx,
                  );
                } else {
                  Schema.findOne(
                    {
                      User: `${author.id}`,
                      Parent: `${target.id}`,
                    },
                    async (err: any, data: any) => {
                      if (data) {
                        client.extras.errNormal(
                          {
                            error: 'You cannot marry a family member!',
                            type: 'reply',
                          },
                          ctx,
                        );
                      } else {
                        Schema.findOne(
                          { User: `${author.id}` },
                          async (err: any, data: { Children: bigint[] }) => {
                            if (data) {
                              if (data.Children.includes(target.id)) {
                                client.extras.errNormal(
                                  {
                                    error: 'You cannot marry a family member!',
                                    type: 'reply',
                                  },
                                  ctx,
                                );
                              } else {
                                propose();
                              }
                            } else {
                              propose();
                            }
                          },
                        );
                      }
                    },
                  );
                }
              },
            );
          }
        });
      }
    });

    async function propose() {
      const row = new Components()
        .addButton('Yes', 'Success', 'propose_accept', { emoji: '✅' })
        .addButton('No', 'Danger', 'propose_deny', { emoji: '❌' });

      const message = await client.extras.embed(
        {
          title: `Marriage proposal`,
          desc: `<@${author.id}> has <@${target.id}> asked to marry them! \n<@${target.id}> click on one of the buttons`,
          components: row,
          content: `<@${target.id}>`,
          type: 'reply',
        },
        ctx,
      );

      const filter = (bot, i) => {
        return i.user.id === target.id;
      };

      client.amethystUtils
        // @ts-ignore
        .awaitComponent(message.id, {
          filter,
          type: 'Button',
        })
        .then(async (i) => {
          if (i.data?.customId == 'propose_accept') {
            Schema.findOne({ User: `${author.id}` }, async (err: any, data) => {
              if (data) {
                data.Partner = `${target.id}`;
                data.save();
              } else {
                new Schema({
                  User: `${author.id}`,
                  Partner: `${target.id}`,
                }).save();
              }
            });

            Schema.findOne({ User: `${target.id}` }, async (err: any, data) => {
              if (data) {
                data.Partner = `${author.id}`;
                data.save();
              } else {
                new Schema({
                  User: `${target.id}`,
                  Partner: `${author.id}`,
                }).save();
              }
            });

            client.extras.embed(
              {
                title: `Marriage proposal - Accepted`,
                desc: `${author} and <@${target.id}> are now married! 👰🎉`,
                components: [],
                content: `<@${target.id}>`,
                type: 'reply',
              },
              ctx,
            );
          }

          if (i.data?.customId == 'propose_deny') {
            client.extras.embed(
              {
                title: `Marriage proposal - Declined`,
                desc: `<@${target.id}> loves someone else and chose not to marry ${author}`,
                components: [],
                content: `<@${target.id}>`,
                type: 'reply',
              },
              ctx,
            );
          }
        })
        .catch((e) => {
          console.error(e);
          client.extras.embed(
            {
              title: `Marriage proposal - Declined`,
              desc: `<@${target.id}> has not answered anything! The wedding is canceled`,
              components: [],
              content: `<@${target.id}>`,
              type: 'reply',
            },
            ctx,
          );
        });
    }
  },
} as CommandOptions;
