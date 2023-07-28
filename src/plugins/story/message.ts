import { Category, RateLimit, TIME_UNIT } from '@discordx/utilities';
import { Bot, ButtonComponent, Guard, SimpleCommandMessage } from 'discordx';
import { Discord, SimpleCommand, SimpleCommandOption, SimpleCommandOptionType } from 'discordx';
import GuildDB from '../../database/models/guild.js';
import { bot } from '../../bot.js';
import { getPluginsBot } from '../../utils/config.js';
import filter from 'leo-profanity';

import {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonInteraction,
  ComponentType,
  EmbedBuilder,
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
@Category('story')
@Guard(
  RateLimit(TIME_UNIT.seconds, 30, {
    rateValue: 3,
  }),
)
export class Story {
  @SimpleCommand({
    name: 'story generate',
    description: 'Create a AI generated story 🖌️',
  })
  async imagine(
    @SimpleCommandOption({
      name: 'prompt',
      description: 'What to write a story about?',
      type: SimpleCommandOptionType.String,
    })
    prompt: string | undefined,
    command: SimpleCommandMessage,
  ) {
    let ctx = command.message;

    if (!ctx.guild) return;

    if (!prompt)
      return bot.extras.errUsage(
        {
          usage: '+story generate <prompt>',
        },
        command,
      );

    let guild = await GuildDB.findOne({ Guild: ctx.guild.id });
    if (!guild)
      guild = new GuildDB({
        Guild: ctx.guild.id,
      });
    if (!(guild.isPremium === 'true')) {
      if (!(await api.hasVoted(ctx.author.id)))
        return ctx.reply({
          content:
            "Please vote for me to keep me growing and show me some love: https://top.gg/bot/931226824753700934/vote and then try again. \n\n Q: Why this change? \n A: Alas, as we host our AI's ourself, we can't at times handle the demand due to automated bots. This is a method to stop some autobots.",
        });
      if (filter.check(prompt))
        return ctx.reply({
          content: 'This prompt is either profane, nfsw or both.',
        });
    }
    let id = ctx.id;
    const comp = new Components();
    comp.addButton('Choice 1', 'Secondary', 'generate-' + id + '-1');
    comp.addButton('Choice 2', 'Secondary', 'generate-' + id + '-2');
    comp.addButton('Choice 3', 'Secondary', 'generate-' + id + '-3');
    comp.addButton('Choice 4', 'Secondary', 'generate-' + id + '-4');

    ctx.reply({
      content: 'Generating...',
    });
    try {
      while (true) {
        const response = await (await fetch(`http://localhost:8083/chatbot/story?id=${id}&text=${prompt}`)).json();

        const image = new AttachmentBuilder(Buffer.from(response.image, 'base64'), {
          name: 'image0.png',
        });

        const embed = new EmbedBuilder()
          .setTitle('Aeona Story Generation')
          .setDescription(response.story + '\n\n\n' + response.options.join('\n'))
          .setImage('attachment://image0.png');

        ctx
          .reply({
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

  @ButtonComponent({
    id: /generate-\d+-\d/gm,
  })
  async generate(ctx: ButtonInteraction) {
    ctx.reply({
      content: 'Generating...',
    });
    let ids = ctx.customId.split('-');
    const comp = new Components();
    comp.addButton('Choice 1', 'Secondary', 'generate-' + ids[1] + '-1');
    comp.addButton('Choice 2', 'Secondary', 'generate-' + ids[1] + '-2');
    comp.addButton('Choice 3', 'Secondary', 'generate-' + ids[1] + '-3');
    comp.addButton('Choice 4', 'Secondary', 'generate-' + ids[1] + '-4');

    const response = await (await fetch(`http://localhost:8083/chatbot/story?id=${ids[1]}&text=${ids[2]}`)).json();

    const image = new AttachmentBuilder(Buffer.from(response.image, 'base64'), {
      name: 'image0.png',
    });

    const embed = new EmbedBuilder().setDescription(response.story + '\n\n\n' + response.options.join('\n'));
    //.setImage('attachment://image0.png');

    await ctx.editReply({
      embeds: [embed],
      files: [image],
      components: comp,
    });
    await ctx.followUp({
      content: `<@${ctx.user.id}> Done!`,
    });
  }
}
