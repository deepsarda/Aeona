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

    let data = await Schema.findOne({ Guild: ctx.guild!.id, Category: name });
    if (!data) {
      data = new Schema({
        Guild: ctx.guild!.id,
        Message: 0,
        Category: name,
        Roles: {},
      });

      data.save();
    }

    async function requestNextRole() {
      if (!data) return;
      try {
        client.helpers.sendMessage(ctx.channel!.id, {
          content: `To add another role to the reaction roles, send \`:emoji: @role\`. Example: \`:sunglasses: @announcementpings \` \n\n **If you have finished adding the roles send \`cancel\` **`,
        });

        const message = await client.utils.awaitMessage(ctx.user!.id, ctx.channel!.id);

        if (message.content.toLowerCase() === 'cancel') return;

        if (message.mentionedRoleIds.length === 0) {
          client.helpers.sendMessage(ctx.channel!.id, {
            content: `<@${ctx.user!.id}> Please mention a role.`,
          });
          return await requestNextRole();
        }

        const role = message.mentionedRoleIds[0];
        const emoji = message.content.replace(`<@&${role}>`, '').trim();
        const parsedEmoji = parseEmoji(emoji);

        if (!parsedEmoji) {
          client.helpers.sendMessage(ctx.channel!.id, {
            content: `<@${ctx.user!.id}> Please mention a valid emoji.`,
          });
          return await requestNextRole();
        }

        data.Roles[emoji] = [
          `${role}`,
          {
            id: `${parsedEmoji.id}`,
            raw: emoji,
          },
        ];

        await Schema.findOneAndUpdate({ Guild: ctx.guild!.id, Category: name }, data);

        client.helpers.sendMessage(ctx.channel!.id, {
          content: `Successfully added ${emoji} to the reaction roles.`,
        });

        return await requestNextRole();
      } catch (e) {
        return;
      }
    }
    await requestNextRole();

    client.extras.succNormal(
      {
        text: 'Reaction role successfully created! Create a panel in the following way',
        fields: [
          {
            name: `Menu panel`,
            value: `\`/reactionroles menu ${name}\``,
            inline: true,
          },
          {
            name: `Button panel`,
            value: `\`/reactionroles button ${name}\``,
            inline: true,
          },
        ],
        type: 'reply',
      },
      ctx.channel,
    );
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
