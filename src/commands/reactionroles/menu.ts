import { CommandOptions, Components, Context } from '@thereallonewolf/amethystframework';

import Schema from '../../database/models/reactionRoles.js';
import { AeonaBot } from '../../extras/index.js';

export default {
  name: 'menu',
  description: 'Generate a menu reactionroles',
  commandType: ['application', 'message'],
  category: 'reactionroles',
  args: [
    {
      name: 'name',
      description: 'The name of the reaction roles',
      required: true,
      type: 'String',
    },
    {
      name: 'channel',
      description: 'The channel to make the menu in.',
      required: true,
      type: 'Channel',
    },
  ],
  userGuildPermissions: ['MANAGE_ROLES'],
  async execute(client: AeonaBot, ctx: Context) {
    if (!ctx.guild || !ctx.user || !ctx.channel) return;
    const category = ctx.options.getString('name', true);
    const channel = (await ctx.options.getChannel('channel')) || ctx.channel;

    const lower = category.toLowerCase();
    const upper = lower.charAt(0).toUpperCase() + lower.substring(1);

    Schema.findOne({ Guild: ctx.guild!.id, Category: category }, async (err, data) => {
      if (!data)
        return client.extras.errNormal(
          {
            error: `No data found!`,
            type: 'reply',
          },
          ctx,
        );

      const a = Object.keys(data.Roles);
      const roles = await client.helpers.getRoles(ctx.guild!.id);
      const map: string[] = [];
      const labels: any[] = [];
      for (let i = 0; i < a.length; i++) {
        const b = a[i];

        const role = roles.find((role) => role.id == BigInt(data.Roles[b][0]));
        if (role) {
          map.push(`${data.Roles[b][1].raw} | <@&${role.id}>`);
          const emoji = parseEmoji(data.Roles[b][1].raw)!;
          labels.push({
            label: `${role.name}`,
            description: `Add or remove the role ${role.name}`,
            emoji: emoji,
            value: data.Roles[b][1].raw,
          });
        }
      }
      const mappedstring = map.join('\n');

      const row = new Components();
      row.addSelectComponent('Choose your row', 'reaction_select', labels, '❌ Nothing selected', 1, map.length);
      client.extras
        .embed(
          {
            title: `${upper} Roles`,
            desc: `Choose your roles in the menu! \n\n${mappedstring}`,
            components: row,
            type: 'reply',
          },
          channel,
        )
        .then((msg) => {
          data.Message = msg.id;
          data.save();
        });

      client.extras.succNormal(
        {
          text: 'Reaction panel successfully created! \n TIP: `Use the commands under the *embed* category to modify thier look.` \n Example use: `+editembed`',
          type: 'ephemeral',
        },
        ctx,
      );
    });
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
