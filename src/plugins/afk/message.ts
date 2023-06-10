import { Category, RateLimit, TIME_UNIT } from '@discordx/utilities';
import { ArgsOf, Bot, Guard, On, SimpleCommandMessage } from 'discordx';
import { Discord, SimpleCommand, SimpleCommandOption, SimpleCommandOptionType } from 'discordx';
import Schema from '../../database/models/afk.js';
import { bot } from '../../bot.js';
import { getPluginsBot } from '../../utils/config.js';
import { AeonaBot } from '../../utils/types.js';

@Discord()
@Bot(...getPluginsBot('afk'))
@Category('afk')
export class Afk {
  @SimpleCommand({
    name: 'afk',
    aliases: ['afk set'],
    description: 'Set your AFK 😴',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
  )
  async afk(
    @SimpleCommandOption({
      name: 'reason',
      description: 'Reason for going afk',
      type: SimpleCommandOptionType.String,
    })
    reason: string | undefined,
    command: SimpleCommandMessage,
  ) {
    let ctx = command.message;

    reason = reason || 'No reason given! 🛌';

    const data = await Schema.findOne({ Guild: ctx.guildId, User: ctx.author.id });
    if (data)
      return bot.extras.errNormal(
        {
          error: `You're already afk!`,
          type: 'reply',
        },
        command,
      );

    new Schema({
      Guild: ctx.guildId,
      User: `${ctx.author.id}`,
      Message: reason,
    }).save();

    let nick = ctx.author.username;
    if (ctx.member?.nickname) nick = ctx.member.nickname;

    if (!nick.includes(`[AFK] `)) ctx.member?.setNickname(`[AFK] ${nick}`).catch();

    bot.extras.embed(
      {
        title: `Your AFK has been set up succesfully`,
        desc: '',
        type: 'ephemeral',
      },
      command,
    );

    bot.extras.embed(
      {
        title: '',
        desc: `<@${ctx.author.id}> is now afk! **Reason:** ${reason}`,
        type: '',
      },
      command,
    );
  }

  @SimpleCommand({
    name: 'afk list',
    description: 'See all the AFK users 😴',
  })
  async list(command: SimpleCommandMessage) {
    let ctx = command.message;

    const rawboard = await Schema.find({ Guild: ctx.guild!.id });

    if (rawboard.length < 1)
      return bot.extras.errNormal(
        {
          error: 'No data found!',
          type: 'reply',
        },
        command,
      );

    const lb = rawboard.map((e) => `<@!${e.User}> - **Reason** ${e.Message}`);

    await bot.extras.createLeaderboard(`AFK users - ${ctx.guild?.name}`, lb, command);
  }

  @On()
  async messageCreate([message]: ArgsOf<'messageCreate'>, client: AeonaBot) {
    if (message.author.bot) return;

    const data = await Schema.findOne({ Guild: message.guildId, User: message.author.id });
    if (!data) return;
    await Schema.deleteOne({
      Guild: message.guildId,
      User: message.author.id,
    });

    client.extras.simpleMessageEmbed(
      {
        desc: `<@${message.author.id}> is no longer afk!`,
      },
      message,
    );

    if (message.member?.nickname?.startsWith(`[AFK] `)) {
      const name = message.member?.nickname?.replace(`[AFK] `, ``);
      message.member?.setNickname(name).catch();
    }
  }
}
