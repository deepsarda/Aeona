import { Category, PermissionGuard, RateLimit, TIME_UNIT } from '@discordx/utilities';
import { ArgsOf, Bot, Guard, On, SimpleCommandMessage } from 'discordx';
import { Discord, SimpleCommand, SimpleCommandOption, SimpleCommandOptionType } from 'discordx';
import Schema from '../../database/models/guild.js';
import { getPluginsBot } from '../../utils/config.js';
import { bot } from '../../bot.js';
import { AeonaBot } from '../../utils/types.js';

const usersMap = new Map();
const LIMIT = 5;
const TIME = 10000;
const DIFF = 3000;

/**
 * Class representing automod commands
 * @class
 */
@Discord()
@Bot(...getPluginsBot('automod'))
@Category('automod')
@Guard(
  RateLimit(TIME_UNIT.seconds, 30, {
    rateValue: 3,
  }),
  PermissionGuard(['ManageMessages']),
)
export class AutoMod {
  /**
   * Enable/disable antiinvite for your server
   * @param {boolean} boolean - Whether to enable or disable antiinvite
   * @param {SimpleCommandMessage} command - The command message instance
   */
  @SimpleCommand({
    name: 'antiinvite',
    description: ':stop_sign: Stop users from postings discord invites.',
  })
  async antiinvite(
    @SimpleCommandOption({
      name: 'active',
      description: 'Enable or disable antiinvite for your server',
      type: SimpleCommandOptionType.Boolean,
    })
    boolean: boolean | undefined,
    command: SimpleCommandMessage,
  ) {
    if (!boolean) return bot.extras.errUsage({ usage: '+antiinvite <true/false>' }, command);

    const data = await Schema.findOne({ Guild: command.message.guildId });
    if (data) {
      data.AntiInvite = boolean ?? false;
      data.save();
    } else {
      new Schema({
        Guild: command.message.guildId,
        AntiInvite: boolean,
      }).save();
    }

    bot.extras.succNormal(
      {
        text: `Anti invite is now **${boolean ? 'enabled' : 'disabled'}** in this guild`,
      },
      command,
    );
  }

  /**
   * Enable/disable antilinks for your server
   * @param {boolean} boolean - Whether to enable or disable antilinks
   * @param {SimpleCommandMessage} command - The command message instance
   */
  @SimpleCommand({
    name: 'antilink',
    description: ':stop_sign: Stop users from postings links 🔗',
  })
  async antilink(
    @SimpleCommandOption({
      name: 'active',
      description: 'Enable or disable antilinks for your server',
      type: SimpleCommandOptionType.Boolean,
    })
    boolean: boolean | undefined,
    command: SimpleCommandMessage,
  ) {
    if (!boolean) return bot.extras.errUsage({ usage: '+antilink <true/false>' }, command);

    const data = await Schema.findOne({ Guild: command.message.guildId });
    if (data) {
      data.AntiLinks = boolean ?? false;
      data.save();
    } else {
      new Schema({
        Guild: command.message.guildId,
        AntiLinks: boolean,
      }).save();
    }

    bot.extras.succNormal(
      {
        text: `Anti Link is now **${boolean ? 'enabled' : 'disabled'}** in this guild`,
      },
      command,
    );
  }

  /**
   * Enable/disable antispam for your server
   * @param {boolean} boolean - Whether to enable or disable antispam
   * @param {SimpleCommandMessage} command - The command message instance
   */
  @SimpleCommand({
    name: 'antispam',
    description: ':stop_sign: Stop users from spamming.',
  })
  async antispam(
    @SimpleCommandOption({
      name: 'active',
      description: 'Enable or disable antispam for your server',
      type: SimpleCommandOptionType.Boolean,
    })
    boolean: boolean | undefined,
    command: SimpleCommandMessage,
  ) {
    if (!boolean) return bot.extras.errUsage({ usage: '+antispam <true/false>' }, command);
    const data = await Schema.findOne({ Guild: command.message.guildId });
    if (data) {
      data.AntiSpam = boolean ?? false;
      data.save();
    } else {
      new Schema({
        Guild: command.message.guildId,
        AntiSpam: boolean,
      }).save();
    }

    bot.extras.succNormal(
      {
        text: `Anti spam is now **${boolean ? 'enabled' : 'disabled'}** in this guild`,
      },
      command,
    );
  }

  /**
   * Automod event listener
   * @param {Array} args - The arguments for the messageCreate event
   * @param {AeonaBot} client - The Discordx bot instance
   */
  @On()
  async messageCreate([message]: ArgsOf<'messageCreate'>, client: AeonaBot) {
    if (message.author.bot) return;
    if (!message.content || message.content.length < 1) return;

    if (message.member && message.member.permissions.has('ManageMessages')) return;

    const data = await Schema.findOne({ Guild: message.guildId });
    if (!data) return;

    if (data.AntiInvite == true && message.content.includes('discord.gg')) {
      message.delete();

      client.extras.sendEmbedMessage(
        {
          title: `${client.config.emotes.normal.error} Moderator`,
          desc: `Discord links are not allowed in this server!`,
          color: client.config.colors.error,
          content: `<@${message.author.id}>`,
        },
        message,
      );
    } else if (
      data.AntiLinks == true &&
      (message.content.includes('http://') || message.content.includes('https://'))
    ) {
      message.delete();

      client.extras.sendEmbedMessage(
        {
          title: `${client.config.emotes.normal.error} Moderator`,
          desc: `Links are not allowed in this server!`,
          color: client.config.colors.error,
          content: `<@${message.author.id}>`,
        },
        message,
      );
    }

    if (data.AntiSpam == true) {
      if (usersMap.has(message.author.id)) {
        const userData = usersMap.get(message.author.id);
        const { lastMessage, timer } = userData;
        const difference = message.createdTimestamp - lastMessage.createdTimestamp;
        let { msgCount } = userData;

        if (difference > DIFF) {
          clearTimeout(timer);
          userData.msgCount = 1;
          userData.lastMessage = message;
          userData.timer = setTimeout(() => {
            usersMap.delete(message.author.id);
          }, TIME);
          usersMap.set(message.author.id, userData);
        } else {
          ++msgCount;
          if (parseInt(msgCount) === LIMIT) {
            message.delete();
            client.extras.sendEmbedMessage(
              {
                title: `${client.config.emotes.normal.error} Moderator`,
                desc: `It is not allowed to spam in this server!`,
                color: client.config.colors.error,
                content: `<@${message.author.id}>`,
              },
              message,
            );
          } else {
            userData.msgCount = msgCount;
            usersMap.set(message.author.id, userData);
          }
        }
      } else {
        const fn = setTimeout(() => {
          usersMap.delete(message.author.id);
        }, TIME);
        usersMap.set(message.author.id, {
          msgCount: 1,
          lastMessage: message,
          timer: fn,
        });
      }
    }
  }
}
