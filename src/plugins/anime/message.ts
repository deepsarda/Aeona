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
export class Anime {
  @SimpleCommand({
    name: 'bite',
    description: 'Bite another user! 🫦',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
  )
  async bite(
    @SimpleCommandOption({
      name: 'user',
      description: 'User to bite',
      type: SimpleCommandOptionType.User,
    })
    user: User | GuildMember | undefined,
    command: SimpleCommandMessage,
  ) {
    let ctx = command.message;
    if (!user) return bot.extras.errUsage({ usage: '+bite @User' }, command);
    bot.extras.embed(
      {
        title: `${ctx.author.username} bites ${user instanceof User ? user.username : user.displayName} 🫦`,
        image: (await hmfull.HMtai.sfw.bite()).url,
        type: 'reply',
      },
      command,
    );
  }

  @SimpleCommand({
    name: 'bonk',
    description: 'Bonk another user! 💥🔨💢',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
  )
  async bonk(
    @SimpleCommandOption({
      name: 'user',
      description: 'User to bonk',
      type: SimpleCommandOptionType.User,
    })
    user: User | GuildMember | undefined,
    command: SimpleCommandMessage,
  ) {
    let ctx = command.message;
    if (!user) return bot.extras.errUsage({ usage: '+bonk @User' }, command);
    bot.extras.embed(
      {
        title: `${ctx.author.username} bonk ${user instanceof User ? user.username : user.displayName} 💥🔨💢`,
        image: (await hmfull.HMtai.sfw.bonk()).url,
        type: 'reply',
      },
      command,
    );
  }

  @SimpleCommand({
    name: 'boop',
    description: 'Boop another user! 👉',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
  )
  async boop(
    @SimpleCommandOption({
      name: 'user',
      description: 'User to boop',
      type: SimpleCommandOptionType.User,
    })
    user: User | GuildMember | undefined,
    command: SimpleCommandMessage,
  ) {
    let ctx = command.message;
    if (!user) return bot.extras.errUsage({ usage: '+boop @User' }, command);
    bot.extras.embed(
      {
        title: `${ctx.author.username} boops ${user instanceof User ? user.username : user.displayName} 👉`,
        image: (await hmfull.HMtai.sfw.boop()).url,
        type: 'reply',
      },
      command,
    );
  }

  @SimpleCommand({
    name: 'bully',
    description: 'Bully another user! ᕙ(⇀‸↼‶)ᕗ',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
  )
  async bully(
    @SimpleCommandOption({
      name: 'user',
      description: 'User to bully',
      type: SimpleCommandOptionType.User,
    })
    user: User | GuildMember | undefined,
    command: SimpleCommandMessage,
  ) {
    let ctx = command.message;
    if (!user) return bot.extras.errUsage({ usage: '+bully @User' }, command);
    bot.extras.embed(
      {
        title: `${ctx.author.username} bullies ${user instanceof User ? user.username : user.displayName} ᕙ(⇀‸↼‶)ᕗ`,
        image: (await hmfull.HMtai.sfw.bully()).url,
        type: 'reply',
      },
      command,
    );
  }

  @SimpleCommand({
    name: 'cuddle',
    description: 'Cuddle another user! (˶ ˘ ³˘)ˆᵕ ˆ˶)',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
  )
  async cuddle(
    @SimpleCommandOption({
      name: 'user',
      description: 'User to cuddle',
      type: SimpleCommandOptionType.User,
    })
    user: User | GuildMember | undefined,
    command: SimpleCommandMessage,
  ) {
    let ctx = command.message;
    if (!user) return bot.extras.errUsage({ usage: '+cuddle @User' }, command);
    bot.extras.embed(
      {
        title: `${ctx.author.username} cuddles ${
          user instanceof User ? user.username : user.displayName
        } (˶ ˘ ³˘)ˆᵕ ˆ˶)`,
        image: (await hmfull.HMtai.sfw.cuddle()).url,
        type: 'reply',
      },
      command,
    );
  }

  @SimpleCommand({
    name: 'feed',
    description: 'Feed another user! (⚈₋₍⚈)',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
  )
  async feed(
    @SimpleCommandOption({
      name: 'user',
      description: 'User to feed',
      type: SimpleCommandOptionType.User,
    })
    user: User | GuildMember | undefined,
    command: SimpleCommandMessage,
  ) {
    let ctx = command.message;
    if (!user) return bot.extras.errUsage({ usage: '+feed @User' }, command);
    bot.extras.embed(
      {
        title: `${ctx.author.username} feeds ${user instanceof User ? user.username : user.displayName} (⚈₋₍⚈)`,
        image: (await hmfull.HMtai.sfw.feed()).url,
        type: 'reply',
      },
      command,
    );
  }

  @SimpleCommand({
    name: 'hold',
    description: 'Hold another user! 🫂',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
  )
  async hold(
    @SimpleCommandOption({
      name: 'user',
      description: 'User to hold',
      type: SimpleCommandOptionType.User,
    })
    user: User | GuildMember | undefined,
    command: SimpleCommandMessage,
  ) {
    let ctx = command.message;
    if (!user) return bot.extras.errUsage({ usage: '+hold @User' }, command);
    bot.extras.embed(
      {
        title: `${ctx.author.username} holds ${user instanceof User ? user.username : user.displayName}`,
        image: (await hmfull.HMtai.sfw.hold()).url,
        type: 'reply',
      },
      command,
    );
  }

  @SimpleCommand({
    name: 'hug',
    description: 'Hug another user! 🤗',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
  )
  async hug(
    @SimpleCommandOption({
      name: 'user',
      description: 'User to hug',
      type: SimpleCommandOptionType.User,
    })
    user: User | GuildMember | undefined,
    command: SimpleCommandMessage,
  ) {
    let ctx = command.message;
    if (!user) return bot.extras.errUsage({ usage: '+hug @User' }, command);
    bot.extras.embed(
      {
        title: `${ctx.author.username} hugs ${user instanceof User ? user.username : user.displayName} 🤗`,
        image: (await hmfull.HMtai.sfw.hug()).url,
        type: 'reply',
      },
      command,
    );
  }

  @SimpleCommand({
    name: 'kick',
    description: 'Kick another user! 👢',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
  )
  async kick(
    @SimpleCommandOption({
      name: 'user',
      description: 'User to kick',
      type: SimpleCommandOptionType.User,
    })
    user: User | GuildMember | undefined,
    command: SimpleCommandMessage,
  ) {
    let ctx = command.message;
    if (!user) return bot.extras.errUsage({ usage: '+kick @User' }, command);
    bot.extras.embed(
      {
        title: `${ctx.author.username} kicks ${user instanceof User ? user.username : user.displayName}`,
        image: (await hmfull.HMtai.sfw.kick()).url,
        type: 'reply',
      },
      command,
    );
  }

  @SimpleCommand({
    name: 'kill',
    description: 'Kill another user! :knife:',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
  )
  async kill(
    @SimpleCommandOption({
      name: 'user',
      description: 'User to kill',
      type: SimpleCommandOptionType.User,
    })
    user: User | GuildMember | undefined,
    command: SimpleCommandMessage,
  ) {
    let ctx = command.message;
    if (!user) return bot.extras.errUsage({ usage: '+kill @User' }, command);
    bot.extras.embed(
      {
        title: `${ctx.author.username} kills ${user instanceof User ? user.username : user.displayName} :knife:`,
        image: (await hmfull.HMtai.sfw.kill()).url,
        type: 'reply',
      },
      command,
    );
  }

  @SimpleCommand({
    name: 'kiss',
    description: 'Kiss another user! 😘',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
  )
  async kiss(
    @SimpleCommandOption({
      name: 'user',
      description: 'User to kiss',
      type: SimpleCommandOptionType.User,
    })
    user: User | GuildMember | undefined,
    command: SimpleCommandMessage,
  ) {
    let ctx = command.message;
    if (!user) return bot.extras.errUsage({ usage: '+kiss @User' }, command);
    bot.extras.embed(
      {
        title: `${ctx.author.username} kisses ${user instanceof User ? user.username : user.displayName} ❤️`,
        image: (await hmfull.HMtai.sfw.kiss()).url,
        type: 'reply',
      },
      command,
    );
  }

  @SimpleCommand({
    name: 'lick',
    description: 'Lick another user! 💄',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
  )
  async lick(
    @SimpleCommandOption({
      name: 'user',
      description: 'User to lick',
      type: SimpleCommandOptionType.User,
    })
    user: User | GuildMember | undefined,
    command: SimpleCommandMessage,
  ) {
    let ctx = command.message;
    if (!user) return bot.extras.errUsage({ usage: '+lick @User' }, command);
    bot.extras.embed(
      {
        title: `${ctx.author.username} licks ${user instanceof User ? user.username : user.displayName}`,
        image: (await hmfull.HMtai.sfw.lick()).url,
        type: 'reply',
      },
      command,
    );
  }

  @SimpleCommand({
    name: 'pat',
    description: 'Pats another user! ( ´･･)ﾉ(._.`)',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
  )
  async pat(
    @SimpleCommandOption({
      name: 'user',
      description: 'User to pat',
      type: SimpleCommandOptionType.User,
    })
    user: User | GuildMember | undefined,
    command: SimpleCommandMessage,
  ) {
    let ctx = command.message;
    if (!user) return bot.extras.errUsage({ usage: '+pat @User' }, command);
    bot.extras.embed(
      {
        title: `${ctx.author.username} pats ${user instanceof User ? user.username : user.displayName} ( ´･･)ﾉ(._.\`)`,
        image: (await hmfull.HMtai.sfw.pat()).url,
        type: 'reply',
      },
      command,
    );
  }

  @SimpleCommand({
    name: 'poke',
    description: 'Poke another user! 👉',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
  )
  async poke(
    @SimpleCommandOption({
      name: 'user',
      description: 'User to poke',
      type: SimpleCommandOptionType.User,
    })
    user: User | GuildMember | undefined,
    command: SimpleCommandMessage,
  ) {
    let ctx = command.message;
    if (!user) return bot.extras.errUsage({ usage: '+poke @User' }, command);
    bot.extras.embed(
      {
        title: `${ctx.author.username} pokes ${user instanceof User ? user.username : user.displayName}`,
        image: (await hmfull.HMtai.sfw.poke()).url,
        type: 'reply',
      },
      command,
    );
  }

  @SimpleCommand({
    name: 'punch',
    description: 'Punch another user! 👊',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
  )
  async punch(
    @SimpleCommandOption({
      name: 'user',
      description: 'User to punch',
      type: SimpleCommandOptionType.User,
    })
    user: User | GuildMember | undefined,
    command: SimpleCommandMessage,
  ) {
    let ctx = command.message;
    if (!user) return bot.extras.errUsage({ usage: '+punch @User' }, command);
    bot.extras.embed(
      {
        title: `${ctx.author.username} punches ${user instanceof User ? user.username : user.displayName} 👊`,
        image: (await hmfull.HMtai.sfw.punch()).url,
        type: 'reply',
      },
      command,
    );
  }

  @SimpleCommand({
    name: 'slap',
    description: 'Slap another user! ',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
  )
  async slap(
    @SimpleCommandOption({
      name: 'user',
      description: 'User to slap',
      type: SimpleCommandOptionType.User,
    })
    user: User | GuildMember | undefined,
    command: SimpleCommandMessage,
  ) {
    let ctx = command.message;
    if (!user) return bot.extras.errUsage({ usage: '+slap @User' }, command);
    bot.extras.embed(
      {
        title: `${ctx.author.username} slaps ${user instanceof User ? user.username : user.displayName}`,
        image: (await hmfull.HMtai.sfw.slap()).url,
        type: 'reply',
      },
      command,
    );
  }

  @SimpleCommand({
    name: 'threaten',
    description: 'Threaten another user! 💢',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
  )
  async threaten(
    @SimpleCommandOption({
      name: 'user',
      description: 'User to threaten',
      type: SimpleCommandOptionType.User,
    })
    user: User | GuildMember | undefined,
    command: SimpleCommandMessage,
  ) {
    let ctx = command.message;
    if (!user) return bot.extras.errUsage({ usage: '+threaten @User' }, command);
    bot.extras.embed(
      {
        title: `${ctx.author.username} threatens ${user instanceof User ? user.username : user.displayName} 💢`,
        image: (await hmfull.HMtai.sfw.threaten()).url,
        type: 'reply',
      },
      command,
    );
  }

  @SimpleCommand({
    name: 'throw',
    aliases: ['yeet'],
    description: 'Yeet another user! 🗑🤾‍♀️',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
  )
  async throw(
    @SimpleCommandOption({
      name: 'user',
      description: 'User to yeet',
      type: SimpleCommandOptionType.User,
    })
    user: User | GuildMember | undefined,
    command: SimpleCommandMessage,
  ) {
    let ctx = command.message;
    if (!user) return bot.extras.errUsage({ usage: '+throw @User' }, command);
    bot.extras.embed(
      {
        title: `${ctx.author.username} yeets ${user instanceof User ? user.username : user.displayName}`,
        image: (await hmfull.HMtai.sfw.throw()).url,
        type: 'reply',
      },
      command,
    );
  }

  @SimpleCommand({
    name: 'tickle',
    description: 'Tickle another user! 🪶🤣',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
  )
  async tickle(
    @SimpleCommandOption({
      name: 'user',
      description: 'User to tickle',
      type: SimpleCommandOptionType.User,
    })
    user: User | GuildMember | undefined,
    command: SimpleCommandMessage,
  ) {
    let ctx = command.message;
    if (!user) return bot.extras.errUsage({ usage: '+tickle @User' }, command);
    bot.extras.embed(
      {
        title: `${ctx.author.username} tickles ${user instanceof User ? user.username : user.displayName} 🪶🤣`,
        image: (await hmfull.HMtai.sfw.tickle()).url,
        type: 'reply',
      },
      command,
    );
  }
}
