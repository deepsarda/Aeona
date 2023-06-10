import { RateLimit, TIME_UNIT } from '@discordx/utilities';
import { Bot, Guard, Slash, SlashGroup, SlashOption } from 'discordx';
import { Discord } from 'discordx';
import hmfull from 'hmfull';
import { bot } from '../../bot.js';
import { getPluginsBot } from '../../utils/config.js';
import { ApplicationCommandOptionType, CommandInteraction, GuildMember, User } from 'discord.js';

@Discord()
@Bot(...getPluginsBot('anime'))
@SlashGroup({ description: 'Various Roleplay Commands', name: 'anime' })
@SlashGroup({ description: 'Roleplay Commands for 2 users', name: 'multiple', root: 'anime' })
export class Anime {
  @Slash({
    name: 'bite',
    description: 'Bite another user! 🫦',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
  )
  @SlashGroup('multiple', 'anime')
  async bite(
    @SlashOption({
      name: 'user',
      description: 'User to bite',
      type: ApplicationCommandOptionType.User,
      required: true,
    })
    user: User | GuildMember,
    ctx: CommandInteraction,
  ) {
    bot.extras.embed(
      {
        title: `${ctx.user.username} bites ${user instanceof User ? user.username : user.displayName} 🫦`,
        image: (await hmfull.HMtai.sfw.bite()).url,
        type: 'reply',
      },
      ctx,
    );
  }

  @Slash({
    name: 'bonk',
    description: 'Bonk another user! 💥🔨💢',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
  )
  @SlashGroup('multiple', 'anime')
  async bonk(
    @SlashOption({
      name: 'user',
      description: 'User to bonk',
      type: ApplicationCommandOptionType.User,
      required: true,
    })
    user: User | GuildMember,
    ctx: CommandInteraction,
  ) {
    bot.extras.embed(
      {
        title: `${ctx.user.username} bonk ${user instanceof User ? user.username : user.displayName} 💥🔨💢`,
        image: (await hmfull.HMtai.sfw.bonk()).url,
        type: 'reply',
      },
      ctx,
    );
  }

  @Slash({
    name: 'boop',
    description: 'Boop another user! 👉',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
  )
  @SlashGroup('multiple', 'anime')
  async boop(
    @SlashOption({
      name: 'user',
      description: 'User to boop',
      type: ApplicationCommandOptionType.User,
      required: true,
    })
    user: User | GuildMember,
    ctx: CommandInteraction,
  ) {
    bot.extras.embed(
      {
        title: `${ctx.user.username} boops ${user instanceof User ? user.username : user.displayName} 👉`,
        image: (await hmfull.HMtai.sfw.boop()).url,
        type: 'reply',
      },
      ctx,
    );
  }

  @Slash({
    name: 'bully',
    description: 'Bully another user! ᕙ(⇀‸↼‶)ᕗ',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
  )
  @SlashGroup('multiple', 'anime')
  async bully(
    @SlashOption({
      name: 'user',
      description: 'User to bully',
      type: ApplicationCommandOptionType.User,
      required: true,
    })
    user: User | GuildMember,
    ctx: CommandInteraction,
  ) {
    bot.extras.embed(
      {
        title: `${ctx.user.username} bullies ${user} ᕙ(⇀‸↼‶)ᕗ`,
        image: (await hmfull.HMtai.sfw.bully()).url,
        type: 'reply',
      },
      ctx,
    );
  }

  @Slash({
    name: 'cuddle',
    description: 'Cuddle another user! (˶ ˘ ³˘)ˆᵕ ˆ˶)',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
  )
  @SlashGroup('multiple', 'anime')
  async cuddle(
    @SlashOption({
      name: 'user',
      description: 'User to cuddle',
      type: ApplicationCommandOptionType.User,
      required: true,
    })
    user: User | GuildMember,
    ctx: CommandInteraction,
  ) {
    bot.extras.embed(
      {
        title: `${ctx.user.username} cuddles ${user instanceof User ? user.username : user.displayName} (˶ ˘ ³˘)ˆᵕ ˆ˶)`,
        image: (await hmfull.HMtai.sfw.cuddle()).url,
        type: 'reply',
      },
      ctx,
    );
  }

  @Slash({
    name: 'feed',
    description: 'Feed another user! (⚈₋₍⚈)',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
  )
  @SlashGroup('multiple', 'anime')
  async feed(
    @SlashOption({
      name: 'user',
      description: 'User to feed',
      type: ApplicationCommandOptionType.User,
      required: true,
    })
    user: User | GuildMember,
    ctx: CommandInteraction,
  ) {
    bot.extras.embed(
      {
        title: `${ctx.user.username} feeds ${user instanceof User ? user.username : user.displayName} (⚈₋₍⚈)`,
        image: (await hmfull.HMtai.sfw.feed()).url,
        type: 'reply',
      },
      ctx,
    );
  }

  @Slash({
    name: 'hold',
    description: 'Hold another user! 🫂',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
  )
  @SlashGroup('multiple', 'anime')
  async hold(
    @SlashOption({
      name: 'user',
      description: 'User to hold',
      type: ApplicationCommandOptionType.User,
      required: true,
    })
    user: User | GuildMember,
    ctx: CommandInteraction,
  ) {
    bot.extras.embed(
      {
        title: `${ctx.user.username} holds ${user instanceof User ? user.username : user.displayName}`,
        image: (await hmfull.HMtai.sfw.hold()).url,
        type: 'reply',
      },
      ctx,
    );
  }

  @Slash({
    name: 'hug',
    description: 'Hug another user! 🤗',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
  )
  @SlashGroup('multiple', 'anime')
  async hug(
    @SlashOption({
      name: 'user',
      description: 'User to hug',
      type: ApplicationCommandOptionType.User,
      required: true,
    })
    user: User | GuildMember,
    ctx: CommandInteraction,
  ) {
    bot.extras.embed(
      {
        title: `${ctx.user.username} hugs ${user instanceof User ? user.username : user.displayName} 🤗`,
        image: (await hmfull.HMtai.sfw.hug()).url,
        type: 'reply',
      },
      ctx,
    );
  }

  @Slash({
    name: 'kick',
    description: 'Kick another user! 👢',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
  )
  @SlashGroup('multiple', 'anime')
  async kick(
    @SlashOption({
      name: 'user',
      description: 'User to kick',
      type: ApplicationCommandOptionType.User,
      required: true,
    })
    user: User | GuildMember,
    ctx: CommandInteraction,
  ) {
    bot.extras.embed(
      {
        title: `${ctx.user.username} kicks ${user instanceof User ? user.username : user.displayName}`,
        image: (await hmfull.HMtai.sfw.kick()).url,
        type: 'reply',
      },
      ctx,
    );
  }

  @Slash({
    name: 'kill',
    description: 'Kill another user! :knife:',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
  )
  @SlashGroup('multiple', 'anime')
  async kill(
    @SlashOption({
      name: 'user',
      description: 'User to kill',
      type: ApplicationCommandOptionType.User,
      required: true,
    })
    user: User | GuildMember,
    ctx: CommandInteraction,
  ) {
    bot.extras.embed(
      {
        title: `${ctx.user.username} kills ${user instanceof User ? user.username : user.displayName} :knife:`,
        image: (await hmfull.HMtai.sfw.kill()).url,
        type: 'reply',
      },
      ctx,
    );
  }

  @Slash({
    name: 'kiss',
    description: 'Kiss another user! 😘',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
  )
  @SlashGroup('multiple', 'anime')
  async kiss(
    @SlashOption({
      name: 'user',
      description: 'User to kiss',
      type: ApplicationCommandOptionType.User,
      required: true,
    })
    user: User | GuildMember,
    ctx: CommandInteraction,
  ) {
    bot.extras.embed(
      {
        title: `${ctx.user.username} kisses ${user instanceof User ? user.username : user.displayName} ❤️`,
        image: (await hmfull.HMtai.sfw.kiss()).url,
        type: 'reply',
      },
      ctx,
    );
  }

  @Slash({
    name: 'lick',
    description: 'Lick another user! 💄',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
  )
  @SlashGroup('multiple', 'anime')
  async lick(
    @SlashOption({
      name: 'user',
      description: 'User to lick',
      type: ApplicationCommandOptionType.User,
      required: true,
    })
    user: User | GuildMember,
    ctx: CommandInteraction,
  ) {
    bot.extras.embed(
      {
        title: `${ctx.user.username} licks ${user instanceof User ? user.username : user.displayName}`,
        image: (await hmfull.HMtai.sfw.lick()).url,
        type: 'reply',
      },
      ctx,
    );
  }

  @Slash({
    name: 'pat',
    description: 'Pats another user! ( ´･･)ﾉ(._.`)',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
  )
  @SlashGroup('multiple', 'anime')
  async pat(
    @SlashOption({
      name: 'user',
      description: 'User to pat',
      type: ApplicationCommandOptionType.User,
      required: true,
    })
    user: User | GuildMember,
    ctx: CommandInteraction,
  ) {
    bot.extras.embed(
      {
        title: `${ctx.user.username} pats ${user instanceof User ? user.username : user.displayName} ( ´･･)ﾉ(._.\`)`,
        image: (await hmfull.HMtai.sfw.pat()).url,
        type: 'reply',
      },
      ctx,
    );
  }

  @Slash({
    name: 'poke',
    description: 'Poke another user! 👉',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
  )
  @SlashGroup('multiple', 'anime')
  async poke(
    @SlashOption({
      name: 'user',
      description: 'User to poke',
      type: ApplicationCommandOptionType.User,
      required: true,
    })
    user: User | GuildMember,
    ctx: CommandInteraction,
  ) {
    bot.extras.embed(
      {
        title: `${ctx.user.username} pokes ${user instanceof User ? user.username : user.displayName}`,
        image: (await hmfull.HMtai.sfw.poke()).url,
        type: 'reply',
      },
      ctx,
    );
  }

  @Slash({
    name: 'punch',
    description: 'Punch another user! 👊',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
  )
  @SlashGroup('multiple', 'anime')
  async punch(
    @SlashOption({
      name: 'user',
      description: 'User to punch',
      type: ApplicationCommandOptionType.User,
      required: true,
    })
    user: User | GuildMember,
    ctx: CommandInteraction,
  ) {
    bot.extras.embed(
      {
        title: `${ctx.user.username} punches ${user instanceof User ? user.username : user.displayName} 👊`,
        image: (await hmfull.HMtai.sfw.punch()).url,
        type: 'reply',
      },
      ctx,
    );
  }

  @Slash({
    name: 'slap',
    description: 'Slap another user! ',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
  )
  @SlashGroup('multiple', 'anime')
  async slap(
    @SlashOption({
      name: 'user',
      description: 'User to slap',
      type: ApplicationCommandOptionType.User,
      required: true,
    })
    user: User | GuildMember,
    ctx: CommandInteraction,
  ) {
    bot.extras.embed(
      {
        title: `${ctx.user.username} slaps ${user instanceof User ? user.username : user.displayName}`,
        image: (await hmfull.HMtai.sfw.slap()).url,
        type: 'reply',
      },
      ctx,
    );
  }

  @Slash({
    name: 'threaten',
    description: 'Threaten another user! 💢',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
  )
  @SlashGroup('multiple', 'anime')
  async threaten(
    @SlashOption({
      name: 'user',
      description: 'User to threaten',
      type: ApplicationCommandOptionType.User,
      required: true,
    })
    user: User | GuildMember,
    ctx: CommandInteraction,
  ) {
    bot.extras.embed(
      {
        title: `${ctx.user.username} threatens ${user instanceof User ? user.username : user.displayName} 💢`,
        image: (await hmfull.HMtai.sfw.threaten()).url,
        type: 'reply',
      },
      ctx,
    );
  }

  @Slash({
    name: 'throw',
    description: 'Yeet another user! 🗑🤾‍♀️',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
  )
  @SlashGroup('multiple', 'anime')
  async throw(
    @SlashOption({
      name: 'user',
      description: 'User to yeet',
      type: ApplicationCommandOptionType.User,
      required: true,
    })
    user: User | GuildMember,
    ctx: CommandInteraction,
  ) {
    bot.extras.embed(
      {
        title: `${ctx.user.username} yeets ${user instanceof User ? user.username : user.displayName}`,
        image: (await hmfull.HMtai.sfw.throw()).url,
        type: 'reply',
      },
      ctx,
    );
  }

  @Slash({
    name: 'tickle',
    description: 'Tickle another user! 🪶🤣',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
  )
  @SlashGroup('multiple', 'anime')
  async tickle(
    @SlashOption({
      name: 'user',
      description: 'User to tickle',
      type: ApplicationCommandOptionType.User,
      required: true,
    })
    user: User | GuildMember,
    ctx: CommandInteraction,
  ) {
    bot.extras.embed(
      {
        title: `${ctx.user.username} tickles ${user instanceof User ? user.username : user.displayName} 🪶🤣`,
        image: (await hmfull.HMtai.sfw.tickle()).url,
        type: 'reply',
      },
      ctx,
    );
  }
}
