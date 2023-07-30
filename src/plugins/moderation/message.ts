import { Category, RateLimit, TIME_UNIT } from '@discordx/utilities';
import { Bot, Guard, SimpleCommandMessage } from 'discordx';
import { Discord, SimpleCommand, SimpleCommandOption, SimpleCommandOptionType } from 'discordx';
import hmfull from 'hmfull';
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
        name: "kick",
        description: "Kick a member from the server!"
    })
    async kick(
        @SimpleCommandOption({
            name: "member",
            description: "The member to be kicked",
            type: SimpleCommandOption.User
        })
        user: User | GuildMember | undefined,
        @SimpleCommandOption({
            name: 'reason',
            description: 'Why you want to kick the member',
            type: SimpleCommandOptionType.String,
          })
          reason: string = 'No reason given!',
          command: SimpleCommandMessage,
    ) {
        const ctx = command.message;

        if (!user) return bot.extras.errUsage({ usage: '+boop @User [reason]' }, command);

        bot.extras.embed(
            {
                title: `${ctx.author.username} was kicked out of the server!`,
                description: `User: ${ctx.author}\nAction: Kicked\nReason: ${reason}`,
                type: 'reply',
            },
            command
        );
    }
}