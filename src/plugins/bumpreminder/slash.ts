import { PermissionGuard, RateLimit, TIME_UNIT } from '@discordx/utilities';
import { Bot, Guard, SlashGroup } from 'discordx';
import { Discord, Slash, SlashOption } from 'discordx';
import Schema from '../../database/models/bumpreminder.js';
import { bot } from '../../bot.js';
import { getPluginsBot } from '../../utils/config.js';
import { ApplicationCommandOptionType, CommandInteraction, Role, TextChannel } from 'discord.js';

@Discord()
@Bot(...getPluginsBot('bumpreminder'))
@SlashGroup({
  name: 'bumpreminder',
  description: 'Some commands to use the bump reminder 🔔',
})
export class BumpReminder {
  @Slash({
    name: 'setup',
    description: 'Setup the bump reminder 🔔',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
    PermissionGuard(['ManageChannels']),
  )
  @SlashGroup('bumpreminder')
  async setup(
    @SlashOption({
      name: 'channel',
      description: 'Channel to send the bump reminder in.',
      type: ApplicationCommandOptionType.Channel,
      required: true,
    })
    channel: TextChannel,
    @SlashOption({
      name: 'role',
      description: 'Role to ping when the bump reminder is sent',
      type: ApplicationCommandOptionType.Role,
      required: true,
    })
    role: Role,
    command: CommandInteraction,
  ) {
    let reminder = await Schema.findOne({ Guild: command.guild!.id });
    if (!reminder)
      reminder = new Schema({
        Guild: command.guild!.id,
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

  @Slash({
    name: 'message',
    description: "Set the reminder's message 📑",
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
    PermissionGuard(['ManageChannels']),
  )
  @SlashGroup('bumpreminder')
  async message(
    @SlashOption({
      name: 'message',
      description: 'Type the message or `default` to use the default message',
      type: ApplicationCommandOptionType.String,
      required: true,
    })
    message: string,
    command: CommandInteraction,
  ) {
    let data = await Schema.findOne({ Guild: command.guild!.id });
    if (!data) {
      data = new Schema({
        Message: message.toUpperCase() == 'DEFAULT' ? undefined : message,
        Guild: command.guild!.id,
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

  @Slash({
    name: 'delete',
    description: 'Delete the bump reminder 🗑️',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
    PermissionGuard(['ManageChannels']),
  )
  @SlashGroup('bumpreminder')
  async delete(command: CommandInteraction) {
    await Schema.deleteOne({
      Guild: command.guild!.id,
    });

    bot.extras.succNormal(
      {
        text: 'Bump reminder deleted',
      },
      command,
    );
  }
}
