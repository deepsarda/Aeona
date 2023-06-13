import { Category, PermissionGuard, RateLimit, TIME_UNIT } from '@discordx/utilities';
import { ArgsOf, Bot, Guard, On, SimpleCommandMessage } from 'discordx';
import { Discord, SimpleCommand, SimpleCommandOption, SimpleCommandOptionType } from 'discordx';
import Schema from '../../database/models/bumpreminder.js';
import { bot } from '../../bot.js';
import { getPluginsBot } from '../../utils/config.js';
import { AeonaBot } from '../../utils/types.js';
import { Role, TextChannel } from 'discord.js';

let checkingBumpReminder = false;

@Discord()
@Bot(...getPluginsBot('bumpreminder'))
@Category('bumpreminder')
export class BumpReminder {
  @SimpleCommand({
    name: 'bumpreminder',
    aliases: ['bumpreminder setup'],
    description: 'Setup the bump reminder 🔔',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
    PermissionGuard(['ManageChannels']),
  )
  async setup(
    @SimpleCommandOption({
      name: 'channel',
      description: 'Channel to send the bump reminder in.',
      type: SimpleCommandOptionType.Channel,
    })
    channel: TextChannel | undefined,
    @SimpleCommandOption({
      name: 'role',
      description: 'Role to ping when the bump reminder is sent',
      type: SimpleCommandOptionType.Role,
    })
    role: Role | undefined,
    command: SimpleCommandMessage,
  ) {
    let ctx = command.message;

    if (!channel || !role)
      return bot.extras.errUsage(
        {
          usage: '+bumpreminder setup <channel> <role>',
        },
        command,
      );

    let reminder = await Schema.findOne({ Guild: ctx.guild!.id });
    if (!reminder)
      reminder = new Schema({
        Guild: ctx.guild!.id,
        Channel: channel.id,
        Role: role.id,
        LastBumpedReminder: Date.now(),
      });
    else {
      reminder.Channel = `${channel.id}`;
      reminder.Role = `${role.id}`;
    }

    bot.extras.embed(
      {
        title: `Successfully setup bumpreminder`,
        desc: `I will automatically start reminding after next successful bump.`,
        fields: [
          {
            name: '<:channel:1049292166343688192> Channel',
            value: `<#${channel.id}>`,
            inline: true,
          },
          {
            name: '<:role:1062978537436491776> Role',
            value: `<@&${role.id}>`,
            inline: true,
          },
        ],
        type: 'reply',
      },
      command,
    );

    reminder.save();
  }

  @SimpleCommand({
    name: 'bumpreminder message',
    description: "Set the reminder's message 📑",
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
    PermissionGuard(['ManageChannels']),
  )
  async message(
    @SimpleCommandOption({
      name: 'message',
      description: 'Type the message or `default` to use the default message',
      type: SimpleCommandOptionType.String,
    })
    message: string | undefined,
    command: SimpleCommandMessage,
  ) {
    let ctx = command.message;
    if (!message)
      return bot.extras.errUsage(
        {
          usage:
            '+bumpreminder message <message/default> \n **Note:** Use `default` if you want to use the default message',
        },
        command,
      );

    let data = await Schema.findOne({ Guild: ctx.guild!.id });
    if (!data) {
      data = new Schema({
        Message: message.toUpperCase() == 'DEFAULT' ? undefined : message,
        Guild: ctx.guild!.id,
      });
    } else {
      data.Message = message.toUpperCase() == 'DEFAULT' ? undefined : message;
    }

    data.save();

    bot.extras.succNormal(
      {
        text: message.toUpperCase() == 'DEFAULT' ? 'Default message set' : `Set message to \`${message}\``,
      },
      command,
    );
  }

  @SimpleCommand({
    name: 'bumpreminder delete',
    description: 'Delete the bump reminder',
    aliases: ['bumpreminder reset'],
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
    PermissionGuard(['ManageChannels']),
  )
  async delete(command: SimpleCommandMessage) {
    let ctx = command.message;
    await Schema.deleteOne({
      Guild: ctx.guild!.id,
    });

    bot.extras.succNormal(
      {
        text: 'Bump reminder deleted',
      },
      command,
    );
  }

  @On()
  async messageCreate([message]: ArgsOf<'messageCreate'>, client: AeonaBot) {
    if (!message.author.bot) return;
    if (
      message.embeds.length &&
      message.embeds[0].description &&
      message.embeds[0].description.indexOf('Bump done') > -1
    ) {
      const schema = await Schema.findOne({ Guild: message.guildId });
      if (schema) {
        message.channel.send({
          content: 'Thank you for bumping us! <:AH_LoveCat:1013087175555948544> \n I shall remind you in 2 hours.',
        });
        schema.LastBump = Date.now();
        schema.save();
      }
    }
    if (!checkingBumpReminder) {
      checkingBumpReminder = true;

      setInterval(async () => {
        const reminders = await Schema.find();
        for (const reminder of reminders) {
          try {
            if (!reminder.LastBump || !reminder.Channel) return;
            if (Date.now() > reminder.LastBump + 7200000) {
              reminder.LastBump = Date.now();
              reminder.save();

              const channel = await client.channels.cache.get(reminder.Channel);
              if (channel)
                await client.extras.embed(
                  {
                    content: `<@&${reminder.Role}>`,
                    title: `Time to bump!`,
                    desc: reminder.Message ?? `Use /bump to bump this server!`,
                    type: 'reply',
                  },
                  channel as unknown as TextChannel,
                );
            }
          } catch (err) {
            //
          }
        }
      }, 1000 * 60);
    }
  }
}
