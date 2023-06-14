import { PermissionGuard, RateLimit, TIME_UNIT } from '@discordx/utilities';
import { Bot, Guard, SlashGroup } from 'discordx';
import { Discord, Slash, SlashOption } from 'discordx';

import { bot } from '../../bot.js';
import { getPluginsBot } from '../../utils/config.js';
import { ApplicationCommandOptionType, CommandInteraction, TextChannel } from 'discord.js';

@Discord()
@Bot(...getPluginsBot('embed'))
@SlashGroup({
  name: 'embed',
  description: 'Commands to edit and create embeds. 📝',
})
export class BumpReminder {
  @Slash({
    name: 'create',
    description: 'Create an embed. 📝',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
    PermissionGuard(['ManageMessages']),
  )
  @SlashGroup('embed')
  async create(
    @SlashOption({
      name: 'channel',
      description: 'Channel to send the message in.',
      type: ApplicationCommandOptionType.Channel,
      required: true,
    })
    channel: TextChannel,
    command: CommandInteraction,
  ) {
    bot.extras.createInterface(command, '_ _', {
      callback: async (data) => {
        const config = await bot.extras.getEmbedConfig({
          guild: command.guild!,
          user: command.user,
        });
        channel.send(bot.extras.generateEmbedFromData(config, data));
        command.reply({ content: 'Successfully sent embed in ' + channel.toString() });
      },
    });
  }

  @Slash({
    name: 'edit',
    description: 'Edit a message sent by me. 📑',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
    PermissionGuard(['ManageMessages']),
  )
  @SlashGroup('embed')
  async edit(
    @SlashOption({
      name: 'channel',
      description: 'Channel the message is in.',
      type: ApplicationCommandOptionType.Channel,
      required: true,
    })
    channel: TextChannel,
    @SlashOption({
      name: 'messageid',
      description: 'The id of the message to edit. 📑',
      type: ApplicationCommandOptionType.String,
      required: true,
    })
    messageId: string,
    command: CommandInteraction,
  ) {
    const message = await channel.messages.fetch(messageId);
    if (!message)
      return bot.extras.errNormal(
        {
          error:
            'No message found! \n Make sure the channel is the same channel as the message and the message id is correct',
        },
        command,
      );

    const embed = message.embeds && message.embeds.length > 0 ? message.embeds[0] : {};

    bot.extras.createInterface(command, '', {
      ...embed,
      content: message.content,
      callback: async (data) => {
        const config = await bot.extras.getEmbedConfig({
          guild: command.guild!,
          user: command.user,
        });
        message.edit(bot.extras.generateEmbedFromData(config, data));
        command.reply({ content: 'Successfully edited message. \n🔗 Link: ' + message.url });
      },
    });
  }

  @Slash({
    name: 'variables',
    description: 'Different variables for embeds. 📑',
  })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      rateValue: 3,
    }),
    PermissionGuard(['ManageMessages']),
  )
  @SlashGroup('embed')
  async delete(command: CommandInteraction) {
    bot.extras.embed(
      {
        title: `Variables for you to use.`,
        desc: `
            <:ayyy:1056627813286952980> **User Variables**
             __Variable <:F_Arrow:1049291677359153202> Description <:F_Arrow:1049291677359153202> 
             \`{user:username}\` <:F_Arrow:1049291677359153202> User's Name 
             \`{user:discriminator}\` <:F_Arrow:1049291677359153202> User's Discriminator
             \`{user:tag}\` <:F_Arrow:1049291677359153202> User's Tag
             \`{user:mention}\` <:F_Arrow:1049291677359153202> User ping
             \`{user:invites}\` <:F_Arrow:1049291677359153202> Number of users invited
             \`{user:invites:left}\` <:F_Arrow:1049291677359153202> Number of users left after inviting
             \`{user:level}\` <:F_Arrow:1049291677359153202> User's level
             \`{user:xp}\` <:F_Arrow:1049291677359153202> User's xp
             \`{user:rank}\` <:F_Arrow:1049291677359153202> User's rank
             \`{user:avatar}\` <:F_Arrow:1049291677359153202> Link to user's avatar
           <:YaeSmug:1062031989714198678> **Inviter Variables** *The user who invited the user*
             \`{inviter:username}\` <:F_Arrow:1049291677359153202> User's Name 
             \`{inviter:discriminator}\` <:F_Arrow:1049291677359153202> User's Discriminator
             \`{inviter:tag}\` <:F_Arrow:1049291677359153202> User's Tag
             \`{inviter:mention}\` <:F_Arrow:1049291677359153202> User ping
             \`{inviter:invites}\` <:F_Arrow:1049291677359153202> Number of users invited
             \`{inviter:invites:left}\` <:F_Arrow:1049291677359153202> Number of users left after inviting
             \`{inviter:level}\` <:F_Arrow:1049291677359153202> User's level
             \`{inviter:xp}\` <:F_Arrow:1049291677359153202> User's xp
             \`{inviter:rank}\` <:F_Arrow:1049291677359153202> User's rank
             \`{inviter:avatar}\` <:F_Arrow:1049291677359153202> Link to user's avatar
           <:AH_LoveCat:1050681792060985414> **Server Variables**
             \`{guild:name}\` <:F_Arrow:1049291677359153202> Server's Name
             \`{guild:owner}\` <:F_Arrow:1049291677359153202> Ping to the server's owner
             \`{guild:members}\` <:F_Arrow:1049291677359153202> Number of users in this server.
             \`{guild:tier}\` <:F_Arrow:1049291677359153202> Server's boosting tier
             \`{guild:description}\` <:F_Arrow:1049291677359153202> Server's description
             \`{guild:boosts}\` <:F_Arrow:1049291677359153202>The number of boosts this server has
             \`{guild:rules}\` <:F_Arrow:1049291677359153202> The ping of the channel setup for rules
             \`{guild:icon}\` <:F_Arrow:1049291677359153202> Link to server's icon
             \`{guild:banner}\` <:F_Arrow:1049291677359153202> Link to server's banner
    
    
             **Remove remove this click on \`Set/Delete Description\` and then send \`cancel\`.**
            `,
      },
      command,
    );
  }
}
