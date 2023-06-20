import { Category, ICategory, RateLimit, TIME_UNIT } from '@discordx/utilities';
import { Bot, DSimpleCommand, Guard, MetadataStorage, SimpleCommandMessage } from 'discordx';
import { Discord, SimpleCommand, SimpleCommandOption, SimpleCommandOptionType } from 'discordx';
import { bot } from '../../bot.js';
import { getPluginsBot } from '../../utils/config.js';
import { ChannelType, Collection, GuildCacheMessage, GuildMember, ThreadMemberManager, User } from 'discord.js';
import { Pagination, PaginationResolver, PaginationType } from '@discordx/pagination';
@Discord()
@Bot(...getPluginsBot('invites'))
@Category('invites')
@Guard(
  RateLimit(TIME_UNIT.seconds, 30, {
    rateValue: 3,
  }),
)
export class Invites {}
