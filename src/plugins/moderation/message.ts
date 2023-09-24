import { Category, RateLimit, TIME_UNIT } from '@discordx/utilities';
import { Bot, Guard, SimpleCommandMessage } from 'discordx';
import { Discord, SimpleCommand, SimpleCommandOption, SimpleCommandOptionType } from 'discordx';

import { bot } from '../../bot.js';
import { getPluginsBot } from '../../utils/config.js';
import { GuildMember, User } from 'discord.js';

@Discord()
@Bot(...getPluginsBot('anime'))
@Category('anime')
@Guard(
  RateLimit(TIME_UNIT.seconds, 30, {
    rateValue: 3,
  }),
)
export class Moderation {
  @SimpleCommand({
    name: 'kick',
    description: 'Kick a member out of the server!',
  })
  async kick(
    @SimpleCommandOption({
      name: 'member',
      description: 'The member to be kicked',
      type: SimpleCommandOptionType.User,
    })
    member: User | GuildMember | undefined,
    @SimpleCommandOption({
      name: 'reason',
      description: 'Why you want to kick the member',
      type: SimpleCommandOptionType.String,
    })
    reason = 'No reason given!',
    command: SimpleCommandMessage,
  ) {
    const ctx = command.message;

    if (!member) return bot.extras.errUsage({ usage: '+kick @Member [reason]' }, command);

    bot.extras.embed(
      {
        title: `${ctx.author.username} was kicked out of the server!`,
        desc: `Member: ${ctx.author}\nAction: Kicked\nReason: ${reason}`,
        type: 'reply',
      },
      command,
    );
  }

  @SimpleCommand({
    name: 'ban',
    description: 'Ban a member from the server!',
  })
  async ban(
    @SimpleCommandOption({
      name: 'member',
      description: 'The member to be banned',
      type: SimpleCommandOptionType.User,
    })
    member: User | GuildMember | undefined,
    @SimpleCommandOption({
      name: 'reason',
      description: 'Why you want to ban the member',
      type: SimpleCommandOptionType.String,
    })
    reason = 'No reason given!',
    command: SimpleCommandMessage,
  ) {
    const ctx = command.message;

    if (!member) return bot.extras.errUsage({ usage: '+ban @Member [reason]' }, command);

    bot.extras.embed(
      {
        title: `${ctx.author.username} was banned from the server!`,
        desc: `Member: ${ctx.author}\nAction: Banned\nReason: ${reason}`,
        type: 'reply',
      },
      command,
    );
  }
}
