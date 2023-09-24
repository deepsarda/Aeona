import { RateLimit, TIME_UNIT } from '@discordx/utilities';
import { Bot, Guard, Slash, SlashGroup, SlashOption } from 'discordx';
import { Discord } from 'discordx';
import { bot } from '../../bot.js';
import { getPluginsBot } from '../../utils/config.js';
import Premium from '../../database/models/premium.js';
import GuildDB from '../../database/models/guild.js';
import { ApplicationCommandOptionType, CommandInteraction, TextChannel } from 'discord.js';
import moment from 'moment';
import uniqui from 'uniqid';

@Discord()
@Bot(...getPluginsBot('tools'))
@SlashGroup({
  name: 'tools',
  description: 'Various miscellaneous commands for the bot. 🧰',
})
@SlashGroup('tools')
@Guard(
  RateLimit(TIME_UNIT.seconds, 30, {
    rateValue: 3,
  }),
)
export class Tools {
  @Slash({
    name: 'redeem',
    description: 'Reedem a premium code for this server. 🎉',
  })
  async code(
    @SlashOption({
      name: 'code',
      description: 'Code to eval',
      type: ApplicationCommandOptionType.String,
      required: true,
    })
    code: string,
    command: CommandInteraction,
  ) {
    let guildDB = await GuildDB.findOne({ Guild: `${command.guildId}` });
    if (!guildDB) {
      guildDB = new GuildDB({
        Guild: `${command.guildId}`,
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
            id: `${command.user.id}`,
            tag: `${command.user.username}#${command.user.discriminator}`,
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

                  You've recently redeemed a code in **${command.guild!.name}** and here is your receipt:

                  **Reciept ID:** ${id}
                  **Redeem Time:** ${redeemtime}
                  **Guild Name:** ${command.guild!.name}
                  **Guild ID:** ${command.guild!.id}`,
          },
          (await command.user.createDM()) as unknown as TextChannel,
        );

        bot.extras.embed(
          {
            desc: `**Congratulations!**

**${command.guild!.name}** Is now a premium guild! Thanks a ton!

**Could not send your Reciept via dms so here it is:**
**Reciept ID:** ${id}
**Redeem Date:** ${redeemtime}
**Guild Name:** ${command.guild!.name}
**Guild ID:** ${command.guild!.id}

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
