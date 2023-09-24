import { Category, PermissionGuard, RateLimit, TIME_UNIT } from '@discordx/utilities';
import { ArgsOf, Bot, Guard, On, SimpleCommand, SimpleCommandMessage, Slash, SlashGroup } from 'discordx';
import { Discord } from 'discordx';

import { getPluginsBot } from '../../utils/config.js';

import { CommandInteraction } from 'discord.js';
import { createSetupWizard } from '../../utils/setupWizard.js';
import schema from '../../database/models/welcome.js';
import { AeonaBot } from '../../utils/types.js';
import { bot } from '../../bot.js';

@Discord()
@Bot(...getPluginsBot('welcome'))
@Category('setup')
@SlashGroup({
  name: 'setup',
  description: 'Various commands setup up my various features. 🛠️',
})
@Guard(
  RateLimit(TIME_UNIT.seconds, 30, {
    rateValue: 3,
  }),
  PermissionGuard(['ManageChannels']),
)
@SlashGroup('setup')
export class Welcome {
  @SimpleCommand({
    name: 'setup welcome',
    description: 'Set a channel for the wishing your members goodbye 👋',
  })
  async chatbotMessage(command: SimpleCommandMessage) {
    createSetupWizard(
      command,
      'Welcome',
      {
        createCallback() {},
        options: [
          {
            name: 'message',
            callback() {},
            default: '{user:mention} has left {guild:name}. \n We now have {guild:members} users.',
            id: 'message',
            schemaParam: 'Message',
          },
        ],
      },
      schema,
    );
  }

  @Slash({
    name: 'welcome',
    description: 'Set a channel for wishing your members goodbye 👋',
  })
  async chatbotSlash(command: CommandInteraction) {
    createSetupWizard(
      command,
      'Welcome',
      {
        createCallback() {},
        options: [
          {
            name: 'message',
            callback() {},
            default: '{user:mention} has left {guild:name}. \n We now have {guild:members} users.',
            id: 'message',
            schemaParam: 'Message',
          },
        ],
      },
      schema,
    );
  }

  @On()
  async guildMemberRemove([member]: ArgsOf<'guildMemberRemove'>, client: AeonaBot) {
    //Wait for 3 seconds
    await wait(3000);

    const data = await schema.find({ Guild: member.guild.id });
    if (!data) return;

    const config = await client.extras.getEmbedConfig({
      guild: member.guild,
      user: member.user!,
    });

    for (let i = 0; i < data.length; i++) {
      const schema = data[i];

      let message = {
        content: '{user:mention} has joined {guild:name} 🎉. \n We now have {guild:members} users.',
      };

      if (schema.Message) {
        try {
          message = JSON.parse(schema.Message);
        } catch (e) {
          //
        }
      }
      if (schema.Channel) {
        let channel = bot.channels.cache.get(schema.Channel);
        if (!channel) {
          channel = (await bot.channels.fetch(schema.Channel)) ?? undefined;
        }

        //@ts-ignore
        channel?.send(client.extras.generateEmbedFromData(config, message));
      }
    }
  }
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
