import { Category, RateLimit, TIME_UNIT } from '@discordx/utilities';
import { ArgsOf, Bot, Guard, On, SimpleCommandMessage } from 'discordx';
import { Discord, SimpleCommand, SimpleCommandOption, SimpleCommandOptionType } from 'discordx';
import { bot } from '../../bot.js';
import { getPluginsBot } from '../../utils/config.js';
import voucher_codes from 'voucher-code-generator';
import util from 'util';
import Premium from '../../database/models/premium.js';
import guild from '../../database/models/guild.js';
import { EmbedBuilder, NewsChannel, TextChannel, WebhookClient } from 'discord.js';
import { AeonaBot } from '../../utils/types.js';

const webhookClient = new WebhookClient({ url: process.env.WEBHOOKURL! });

@Discord()
@Bot(...getPluginsBot('owner'))
@Category('owner')
@Guard(
  RateLimit(TIME_UNIT.seconds, 30, {
    rateValue: 3,
  }),
)
export class Owners {
  @SimpleCommand({
    name: 'eval',
    description: 'Command for bot owner',
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
    if (!bot.config.owners.includes(command.message.author.id))
      return bot.extras.errNormal(
        {
          error: 'You are not an owner!',
          type: 'reply',
        },
        command,
      );
    code = command.argString;
    if (!code) return;

    let embed = ``;
    try {
      let output = eval(code);
      if (typeof output !== 'string') output = util.inspect(output, { depth: 0 });

      embed = `\`\`\`js\n${output.length > 1024 ? 'Too large to display.' : output}\`\`\``;
    } catch (err: any) {
      embed = `\`\`\`js\n${err.length > 1024 ? 'Too large to display.' : err}\`\`\``;
    }

    await bot.extras.embed(
      {
        title: 'Output',
        desc: embed,
      },
      command,
    );
  }

  @SimpleCommand({
    name: 'createcode',
    description: 'Create a permium code',
  })
  async list(command: SimpleCommandMessage) {
    if (!bot.config.owners.includes(command.message.author.id))
      return bot.extras.errNormal(
        {
          error: 'You are not an owner!',
          type: 'reply',
        },
        command,
      );

    const expiresAt = Date.now() + 2592000000;
    const codePremium = voucher_codes.generate({
      pattern: '####-####-####',
    });

    const c = codePremium.toString().toUpperCase();

    const code = new Premium({
      code: c,
      expiresAt: expiresAt,
      plan: 'month',
    });
    code.save();

    await bot.extras.embed(
      {
        title: `Your code is: ${c}`,
        desc: 'To use it, go to your server and type `+redeem ' + c + '`',
      },
      command,
    );
  }

  @SimpleCommand({
    name: 'createlifetime',
    description: 'Create a lifetime permium code',
  })
  async lifetime(command: SimpleCommandMessage) {
    if (!bot.config.owners.includes(command.message.author.id))
      return bot.extras.errNormal(
        {
          error: 'You are not an owner!',
          type: 'reply',
        },
        command,
      );

    const expiresAt = Date.now() + 2592000000 * 120;
    const codePremium = voucher_codes.generate({
      pattern: '####-####-####',
    });

    const c = codePremium.toString().toUpperCase();

    const code = new Premium({
      code: c,
      expiresAt: expiresAt,
      plan: 'lifetime',
    });
    code.save();

    await bot.extras.embed(
      {
        title: `Your code is: ${c}`,
        desc: 'To use it, go to your server and type `+redeem ' + c + '`',
      },
      command,
    );
  }

  @On()
  async ready() {
    setInterval(async () => {
      const conditional = {
        isPremium: 'true',
      };
      const results = await guild.find(conditional);

      if (results && results.length) {
        for (const result of results) {
          if (Date.now() >= Number(result.Premium!.ExpiresAt)) {
            const guildPremium = await bot.guilds.cache.get(result.Guild!);
            if (guildPremium) {
              const user = await bot.users.fetch(result.Premium!.RedeemedBy!.id);

              if (user) {
                const channel = (await user.createDM()) as unknown as TextChannel;
                bot.extras.errNormal(
                  {
                    error: `Hey ${user.username}, Premium in ${guildPremium.name} has Just expired. \n\nThank you for purchasing premium previously! We hope you enjoyed what you purchased. \n\n If your still a premium member I will be giving you a new premium code shortly.`,
                  },
                  channel,
                );

                //Get support guild
                const guild = await bot.guilds.cache.get('1034419694549094441');

                //Get member
                const member = await guild?.members.fetch(result.Premium!.RedeemedBy!.id);

                //Check if member has role id: 1073654479859220490 or 1042535405553188924
                if (member?.roles.cache.has('1073654479859220490') || member?.roles.cache.has('1042535405553188924')) {
                  const expiresAt = Date.now() + 2592000000;
                  const codePremium = voucher_codes.generate({
                    pattern: '####-####-####',
                  });

                  const c = codePremium.toString().toUpperCase();

                  const code = new Premium({
                    code: c,
                    expiresAt: expiresAt,
                    plan: 'month',
                  });
                  code.save();

                  const embed = new EmbedBuilder()
                    .setTitle('Premium code')
                    .setDescription(
                      `Hello ${member.user.username} \n\n Thank you for using Aeonabot Premium. \n\n Here is your new premium code: ${c} \n\n To use it, go to your server and type \`+redeem ${c}\``,
                    );

                  channel.send({ embeds: [embed] }).catch();
                }
              }

              result.isPremium = 'false';
              //@ts-ignore
              result.Premium!.RedeemedBy.id = null;
              //@ts-ignore
              result.Premium!.RedeemedBy.tag = null;
              //@ts-ignore
              result.Premium!.RedeemedAt = null;
              //@ts-ignore
              result.Premium!.ExpiresAt = null;
              //@ts-ignore
              result.Premium!.Plan = null;

              await result.save();
            }
          }
        }
      }
    }, 500000);
  }

  @On()
  async guildCreate([guild]: ArgsOf<'guildCreate'>, client: AeonaBot) {
    const embed = new EmbedBuilder().setTitle('Added to a new server!').setDescription(
      `Total servers: ${client.guilds.cache.size} 
       'Server name ${guild.name} 
       'Server ID ${guild.id} 
       'Server members ${guild.memberCount} 
       'Server owner <@${guild.ownerId}> (${guild.ownerId})`,
    );

    webhookClient.send({
      embeds: [embed],
    });

    if (guild.publicUpdatesChannel) {
      const newsChannel = bot.channels.cache.get('1057248837238009946') as unknown as NewsChannel;
      newsChannel.addFollower(guild.publicUpdatesChannel);

      guild.publicUpdatesChannel.send({
        content: `Hello there, I have added this channel as the channel which will be used for sending my update and status news. \n To remove it see: https://support.discord.com/hc/en-us/articles/360028384531-Channel-Following-FAQ `,
      });

      guild.publicUpdatesChannel.send({
        content: `
### Some Important Links:

**Docs:** https://docs.aeonabot.xyz
**Support:** https://discord.gg/W8hssA32C9
**Recommended Commands:** https://www.aeonabot.xyz/recommended
**Patreon:** https://www.patreon.com/Aeonabot`,
      });
    } else if (guild.systemChannel) {
      guild.systemChannel.send({
        content: `Hello there, Thank you so much for inviting me! 
        
### Some Important Links:

**Docs:** https://docs.aeonabot.xyz
**Support:** https://discord.gg/W8hssA32C9
**Recommended Commands:** https://www.aeonabot.xyz/recommended
**Patreon:** https://www.patreon.com/Aeonabot`,
      });
    }
  }

  @On()
  async guildDelete([guild]: ArgsOf<'guildDelete'>, client: AeonaBot) {
    const embed = new EmbedBuilder().setTitle('Removed from a server!').setDescription(
      `Total servers: ${client.guilds.cache.size} 
       'Server name ${guild.name} 
       'Server ID ${guild.id} 
       'Server members ${guild.memberCount} 
       'Server owner <@${guild.ownerId}> (${guild.ownerId})`,
    );

    webhookClient.send({
      embeds: [embed],
    });
  }

  @On()
  async guildMemberUpdate([oldMember, newMember]: ArgsOf<'guildMemberUpdate'>, client: AeonaBot) {
    if (newMember.guild.id != '1034419694549094441') return;

    //Find added roles
    const addedRoles = newMember.roles.cache.filter((r) => !oldMember.roles.cache.has(r.id));

    if (addedRoles.has('1073654479859220490') || addedRoles.has('1042535405553188924')) {
      //Dm them a premium code
      const expiresAt = Date.now() + 2592000000;
      const codePremium = voucher_codes.generate({
        pattern: '####-####-####',
      });

      const c = codePremium.toString().toUpperCase();

      const code = new Premium({
        code: c,
        expiresAt: expiresAt,
        plan: 'month',
      });
      code.save();

      const embed = new EmbedBuilder()
        .setTitle('Premium code')
        .setDescription(
          `Hello ${newMember.user.username} \n\n Thank you for using Aeonabot Premium. \n\n Here is your premium code: ${c} \n\n To use it, go to your server and type \`+redeem ${c}\``,
        );

      newMember.send({ embeds: [embed] });
    }
  }
}
