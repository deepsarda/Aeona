import { Category, RateLimit, TIME_UNIT } from '@discordx/utilities';
import { Bot, Guard, SimpleCommandMessage } from 'discordx';
import { Discord, SimpleCommand, SimpleCommandOption, SimpleCommandOptionType } from 'discordx';
import { bot } from '../../bot.js';
import { getPluginsBot } from '../../utils/config.js';
import Premium from '../../database/models/premium.js';
import GuildDB from '../../database/models/guild.js';
import { TextChannel } from 'discord.js';
import moment from 'moment';
import uniqui from 'uniqid';

@Discord()
@Bot(...getPluginsBot('tools'))
@Category('tools')
@Guard(
  RateLimit(TIME_UNIT.seconds, 30, {
    rateValue: 3,
  }),
)
export class Tools {
  @SimpleCommand({
    name: 'redeem',
    description: 'Reedem a premium code for this server. 🎉',
  })
  async code(
    @SimpleCommandOption({
      name: 'code',
      description: 'Code to eval',
      type: SimpleCommandOptionType.String,
    })
    code: string | undefined,
    command: SimpleCommandMessage,
  ) {
    if (!code) {
      return bot.extras.errUsage(
        {
          usage: '`+redeem <code>`',
        },
        command,
      );
    }

    let guildDB = await GuildDB.findOne({ Guild: `${command.message.guildId}` });
    if (!guildDB) {
      guildDB = new GuildDB({
        Guild: `${command.message.guildId}`,
      });
    }

    if (guildDB.isPremium === 'true') {
      bot.extras.errNormal(
        {
          error: `This guild is already premium.`,
        },
        command,
      );
    } else {
      const premium = await Premium.findOne({ code });

      if (premium) {
        const expires = moment(Number(premium.ExpiresAt)).format('dddd, MMMM Do YYYY HH:mm:ss');
        guildDB.isPremium = 'true';

        const data = {
          RedeemedBy: {
            id: `${command.message.author!.id}`,
            tag: `${command.message.author!.username}#${command.message.author!.discriminator}`,
          },
          RedeemedAt: `${Date.now()}`,
          ExpiresAt: premium.ExpiresAt,
          Plan: premium.Plan,
        };

        guildDB.Premium = data;
        await guildDB.save();
        await premium.deleteOne();

        const id = uniqui(undefined, `-${code}`);
        const redeemtime = moment(new Date()).format('dddd, MMMM Do YYYY HH:mm:ss');

        bot.extras.embed(
          {
            desc: `**Premium Subscription**

                  You've recently redeemed a code in **${command.message.guild!.name}** and here is your receipt:

                  **Reciept ID:** ${id}
                  **Redeem Time:** ${redeemtime}
                  **Guild Name:** ${command.message.guild!.name}
                  **Guild ID:** ${command.message.guild!.id}`,
          },
          (await command.message.author.createDM()) as unknown as TextChannel,
        );

        bot.extras.embed(
          {
            desc: `**Congratulations!**

**${command.message.guild!.name}** Is now a premium guild! Thanks a ton!

**Could not send your Reciept via dms so here it is:**
**Reciept ID:** ${id}
**Redeem Date:** ${redeemtime}
**Guild Name:** ${command.message.guild!.name}
**Guild ID:** ${command.message.guild!.id}

**Please make sure to keep this information safe, you might need it if you ever wanna refund / transfer servers.**

**Expires At:** ${expires}`,
          },
          command,
        );
      } else {
        bot.extras.errNormal(
          {
            error: `I was unable to find a premium code like that.`,
          },
          command,
        );
      }
    }
  }
}
