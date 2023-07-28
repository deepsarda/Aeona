import { Category, RateLimit, TIME_UNIT } from '@discordx/utilities';
import { Bot, Guard, SlashOption, SlashGroup } from 'discordx';
import { Discord, Slash, SimpleCommandOption, SimpleCommandOptionType } from 'discordx';
import GuildDB from '../../database/models/guild.js';
import { bot } from '../../bot.js';
import { getPluginsBot } from '../../utils/config.js';
import filter from 'leo-profanity';
import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  AttachmentBuilder,
  CommandInteraction,
  ComponentType,
  MessageActionRowComponentBuilder,
  StringSelectMenuBuilder,
  TextChannel,
} from 'discord.js';
filter.loadDictionary('en');

import Topgg from '@top-gg/sdk';
import { Components } from '../../utils/components.js';
const api = new Topgg.Api(process.env.TOPGG_TOKEN!);

@Discord()
@Bot(...getPluginsBot('story'))
@SlashGroup({
  name: 'story',
  description: 'Create a amazing AI generated Stories 🖌️',
})
@SlashGroup('story')
@Guard(
  RateLimit(TIME_UNIT.seconds, 30, {
    rateValue: 3,
  }),
)
export class Story {
  @Slash({
    name: 'generate',
    description: 'Create a beautiful AI generated story 🖌️',
  })
  async generate(
    @SlashOption({
      name: 'prompt',
      description: 'What to write a story about?',
      type: ApplicationCommandOptionType.String,
      required: true,
    })
    prompt: string | undefined,
    command: CommandInteraction,
  ) {
    if (!command.guild) return;

    if (!prompt)
      return bot.extras.errUsage(
        {
          usage: '+story generate <prompt>',
        },
        command,
      );

    let guild = await GuildDB.findOne({ Guild: command.guild.id });
    if (!guild)
      guild = new GuildDB({
        Guild: command.guild.id,
      });
    if (!(guild.isPremium === 'true')) {
      if (!(await api.hasVoted(command.user.id)))
        return command.reply({
          content:
            "Please vote for me to keep me growing and show me some love: https://top.gg/bot/931226824753700934/vote and then try again. \n\n Q: Why this change? \n A: Alas, as we host our AI's ourself, we can't at times handle the demand due to automated bots. This is a method to stop some autobots.",
        });
      if (filter.check(prompt))
        return command.reply({
          content: 'This prompt is either profane, nfsw or both.',
        });
    }
    let id = command.id;
    const comp = new Components();
    comp.addButton('Choice 1', 'Secondary', 'generate-' + id + '-1');
    comp.addButton('Choice 2', 'Secondary', 'generate-' + id + '-2');
    comp.addButton('Choice 3', 'Secondary', 'generate-' + id + '-3');
    comp.addButton('Choice 4', 'Secondary', 'generate-' + id + '-4');
    command.reply({
      content: 'Generating...',
    });
    try {
      while (true) {
        const response = await (await fetch(`http://localhost:8083/chatbot/story?id=${id}&text=${prompt}`)).json();

        const image = new AttachmentBuilder(Buffer.from(response.image, 'base64'), {
          name: 'image0.png',
        });

        const embed = bot.extras.createEmbed({
          title: 'Aeona Story Generation',
          desc: response.story + '\n\n\n' + response.options.join('\n'),
          image: 'attachments://image0.png',
        });
        command
          .editReply({
            content: 'Generated!',
            embeds: [embed],
            files: [image],
            components: comp,
          })
          .catch((e) => {
            console.error(e);
          });

        return;
      }
    } catch (e) {
      console.error(e);
    }
  }
}
