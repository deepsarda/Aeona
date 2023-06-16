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
@Discord()
@Bot(...getPluginsBot('image'))
@SlashGroup({
  name: 'image',
  description: 'Create a beautiful AI generated images 🖌️',
})
@SlashGroup('image')
@Guard(
  RateLimit(TIME_UNIT.seconds, 30, {
    rateValue: 3,
  }),
)
export class Image {
  @Slash({
    name: 'imagine',
    description: 'Create a beautiful AI generated image 🖌️',
  })
  async imagine(
    @SlashOption({
      name: 'prompt',
      description: 'What to draw?',
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
          usage: '+imagine <prompt>',
        },
        command,
      );

    let guild = await GuildDB.findOne({ Guild: command.guild.id });
    if (!guild)
      guild = new GuildDB({
        Guild: command.guild.id,
      });
    if (!(guild.isPremium === 'true')) {
      if (filter.check(prompt))
        return command.reply({
          content: 'This prompt is either profane, nfsw or both.',
        });
    }

    const comp = new ActionRowBuilder<MessageActionRowComponentBuilder>();

    comp.addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('style')
        .setOptions([
          {
            label: 'accurate',
            description: 'Generates the image most accurate to your prompt but will be less amazing.',
            value: 'accurate',
          },
          {
            label: 'dramatic',
            description: 'Not the most accurate but generates the best images',
            value: 'dramatic',
          },
          {
            label: 'portrait',
            description: 'Best for images of a single living being.',
            value: 'portrait',
          },
          {
            label: 'photo',
            description: 'One of the most accurate and best for real life images. Prefer this over accurate.',
            value: 'photo',
          },
          {
            label: 'fantasy',
            description: 'Generate fantasy style images.',
            value: 'fantasy',
          },
          {
            label: 'anime',
            description: 'Make the generated image in the style of a anime',
            value: 'anime',
          },
          {
            label: 'neo',
            description: 'Gets some neo led colors for your image.',
            value: 'neo',
          },
          {
            label: 'cgi',
            description: 'Make your image like a cgi character.',
            value: 'cgi',
          },
          {
            label: 'oil painting',
            description: 'Make your image like a oil painting',
            value: 'oil',
          },
          {
            label: 'horror',
            description: 'Give your art a horror feeling',
            value: 'horror',
          },
          {
            label: 'steampunk',
            description: 'Make your art in a retro style',
            value: 'steampunk',
          },
          {
            label: 'cyberpunk',
            description: 'Show the future in your images',
            value: 'cyberpunk',
          },
          {
            label: 'synthwave',
            description: 'Make your art colorful',
            value: 'synthwave',
          },
          {
            label: '3D Game',
            description: 'Make your image look like a 3D game',
            value: '3d',
          },
          {
            label: 'epic',
            description: 'Set your image in a epic style',
            value: 'epic',
          },
          {
            label: 'comic',
            description: 'Make your image in a comic strip style does not work all the time!',
            value: 'comic',
          },
          {
            label: 'charcoal',
            description: 'Make the image in charcoal',
            value: 'charcoal',
          },
        ])
        .setPlaceholder('Choose a style'),
    );

    let modifiers =
      ' detailed matte painting, deep color, fantastical, intricate detail, splash screen, complementary colors, fantasy concept art, 8k resolution trending on Artstation Unreal Engine 5';

    const msg = await command.reply({
      content: 'Choose your style...',
      components: [comp],
    });

    const select = await msg
      .awaitMessageComponent({
        filter: (i) => i.user.id === command.user.id,
        componentType: ComponentType.StringSelect,
      })
      .catch();

    const message = await bot.extras.succNormal(
      {
        text: `Generating.... 
        **Prompt:** ${filter.clean(prompt)}
        **Style:** ${select?.values[0]}
        
        PS: While you are waiting did you try out the \`quote\` command?
        `,
      },
      command,
    );

    switch (select?.values[0]) {
      case 'accurate':
        modifiers = '';
        break;
      case 'portrait':
        modifiers =
          ' head and shoulders portrait, 8k resolution concept art portrait by Greg Rutkowski, Artgerm, WLOP, Alphonse Mucha dynamic lighting hyperdetailed intricately detailed Splash art trending on Artstation triadic colors Unreal Engine 5 volumetric lighting';
        break;
      case 'photo':
        modifiers = ' Professional photography, bokeh, natural lighting, megapixels sharp focus';
        break;
      case 'fantasy':
        modifiers =
          ' a masterpiece, 8k resolution, dark fantasy concept art, by Greg Rutkowski, dynamic lighting, hyperdetailed, intricately detailed, Splash screen art, trending on Artstation, deep color, Unreal Engine, volumetric lighting, Alphonse Mucha, Jordan Grimmer, purple and yellow complementary colours';
        break;
      case 'anime':
        modifiers =
          ' Studio Ghibli, Anime Key Visual, by Makoto Shinkai, Deep Color, Intricate, 8k resolution concept art, Natural Lighting, Beautiful Composition';
        break;
      case 'neo':
        modifiers =
          ' neo-impressionism expressionist style oil painting, smooth post-impressionist impasto acrylic painting, thick layers of colourful textured paint';
        break;
      case 'oil':
        modifiers = ' oil painting by James Gurney';
        break;
      case 'horror':
        modifiers = ' horror Gustave Doré Greg Rutkowski';
        break;
      case 'steampunk':
        modifiers = ' steampunk engine';
        break;
      case 'cyberpunk':
        modifiers = ' cyberpunk 2099 blade runner 2049 neon';
        break;
      case 'synthwave':
        modifiers = ' synthwave neon retro';
        break;
      case '3d':
        modifiers = ' trending on Artstation Unreal Engine 3D shading shadow depth';
        break;
      case 'epic':
        modifiers =
          ' Epic cinematic brilliant stunning intricate meticulously detailed dramatic atmospheric maximalist digital matte painting';
        break;
      case 'comic':
        modifiers = ' Mark Brooks and Dan Mumford, comic book art, perfect, smooth';
        break;
      case 'charcoal':
        modifiers = ' hyperdetailed charcoal drawing';
        break;
    }

    const response = await (await fetch(`http://localhost:8083/chatbot/image?prompt=${prompt}`)).json();
    const files = [
      new AttachmentBuilder(response.response[0], {
        name: 'image0.png',
      }),
      new AttachmentBuilder(response.response[1], {
        name: 'image1.png',
      }),
      new AttachmentBuilder(response.response[2], {
        name: 'image2.png',
      }),
    ];
    (bot.channels.cache.get('1044575489118978068') as unknown as TextChannel | undefined)?.send({
      content: `**User:**${command.user.id} ${command.user.tag} \n **Guild:** ${command.guild!.name} ${
        command.guildId
      } \n**Prompt:** ${prompt}\n **Mode:** ${select.values[0]}`,
      files: files,
    });

    message.edit({
      content: `
      **User:**${command.user.id}
      **Prompt:**${prompt}
      **Style:**${select.values[0]}

      **Image: (1/3)**
      `,
      embeds: [],
      files: [files[0]],
    });

    message.channel.send({
      content: `${command.user}
      
      **Image: (2/3)**`,
      files: [files[1]],
    });

    message.channel.send({
      content: `${command.user}
      
      **Image: (3/3)**`,
      files: [files[3]],
    });
  }

  @Slash({
    name: 'quote',
    description: 'Get a AI generated quote. :beers:',
  })
  async quote(command: CommandInteraction) {
    const url = await (await fetch('https://inspirobot.me/api?generate=true')).text();

    bot.extras.embed(
      {
        title: "Here's a quote for you",
        image: url,
      },
      command,
    );
  }
}
