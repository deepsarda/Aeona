import { RateLimit, TIME_UNIT } from '@discordx/utilities';
import { Bot, Guard, SlashOption, SlashGroup } from 'discordx';
import { Discord, Slash } from 'discordx';
import GuildDB from '../../database/models/guild.js';
import { bot } from '../../bot.js';
import { getPluginsBot } from '../../utils/config.js';
import filter from 'leo-profanity';
import {
  ApplicationCommandOptionType,
  AttachmentBuilder,
  CommandInteraction,
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
            'Please **(vote)[https://top.gg/bot/931226824753700934/vote]** for me to access this command and then try again. \n\n **Premium servers can bypass this**\n You can get premium for just **$2.99** [here](https://www.patreon.com/aeonapatreon)',

          components: new Components()
            .addButton('Upvote', 'Link', 'https://top.gg/bot/931226824753700934/vote')
            .addButton('Premium', 'Link', 'https://aeonabot.xyz/premium')
            .addButton('Support', 'Link', 'https://discord.gg/W8hssA32C9'),
        });
      if (filter.check(prompt))
        return command.reply({
          content:
            'This prompt is either profane, nfsw or both. \n\n **Premium servers can bypass this**\n You can get premium for just **$2.99** [here](https://www.patreon.com/aeonapatreon)',
          components: new Components()
            .addButton('Premium', 'Link', 'https://aeonabot.xyz/premium')
            .addButton('Support', 'Link', 'https://discord.gg/W8hssA32C9'),
        });
    }
    const id = command.id;
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
        let image;
        try {
          image = new AttachmentBuilder(Buffer.from(response.image, 'base64'), {
            name: 'image0.png',
          });
        } catch {
          console.log('error with image');
          try {
            console.log(Buffer.from(response.image, 'base64'));
            image = new AttachmentBuilder(Buffer.from(response.image, 'base64'), {
              name: 'image0.png',
            });
          } catch (e) {
            console.error(e);
          }
        }

        const messageContent = response.story + '\n\n\n' + response.options.join('\n');
        const paragraphs = messageContent.split('\n\n');
        const contents: string[] = [''];

        for (let i = 0; i < paragraphs.length; i++) {
          const paragraph = paragraphs[i];
          const content = contents[contents.length - 1];

          const text = content + '\n\n' + paragraph;
          if (text.length > 1500) contents.push(paragraph);
          else contents[contents.length - 1] = text;
        }

        for (let i = 0; i < contents.length; i++) {
          if (i == 0 && i != contents.length - 1) {
            await command.editReply({
              content: contents[i],
            });
          } else if (i == contents.length - 1) {
            if (i != 0)
              await command
                .channel!.send({
                  content: contents[i],
                  files: image ? [image] : [],
                  components: comp,
                })
                .catch((e) => {
                  console.error(e);
                });
            else
              await command.editReply({
                content: contents[i],
                files: image ? [image] : [],
                components: comp,
              });
          } else {
            await command
              .channel!.send({
                content: contents[i],
              })
              .catch((e) => {
                console.error(e);
              });
          }
        }

        command.followUp({
          content: `${command.user}, Generated!`,
        });

        return;
      }
    } catch (e) {
      console.error(e);
    }
  }
}
