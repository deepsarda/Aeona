import { Channel, Guild, User } from 'discord.js';
import ChatbotSchema from '../database/models/chatbot-channel.js';
import { AeonaBot } from '../utils/types.js';
import DBD from 'discord-dashboard';
import SoftUI from 'dbd-soft-ui';
import { Model } from 'mongoose';
import { MetadataStorage } from 'discordx';
export default async function createDashboard(bot: AeonaBot) {
  await DBD.useLicense(process.env.LICENSE!);
  DBD.Dashboard = DBD.UpdatedClass();

  const Dashboard = new DBD.Dashboard({
    port: 8081,
    client: {
      id: bot.user!.id,
      secret: process.env.CLIENT_SECRET,
    },
    redirectUri: `https://dashboard.aeonabot.xyz/callback`,
    domain: 'https://dashboard.aeonabot.xyz',
    ownerIDs: bot.config.owners,
    useThemeMaintenance: true,
    useTheme404: true,
    bot: bot,
    invite: {
      clientId: bot.user!.id,
      scopes: ['bot', 'applications.commands'],
      permissions: '8',
    },
    supportServer: {
      slash: '/support',
      inviteUrl: 'https://aeonabot.xyz/support',
    },
    theme: SoftUI({
      //@ts-expect-error
      storage: new DBD.Handler(),
      customThemeOptions: {
        index: async ({ req, res, config }) => {
          return {
            values: [],
            graph: {},
            cards: [],
          };
        },
      },
      websiteName: 'Aeona Dashboard',
      colorScheme: 'pink',
      supporteMail: 'aeonadevelopers@gmail.com',
      icons: {
        favicon: 'https://aeonabot.xyz/logo.webp',
        noGuildIcon: 'https://pnggrid.com/wp-content/uploads/2021/05/Discord-Logo-Circle-1024x1024.png',
        sidebar: {
          darkUrl: 'https://aeonabot.xyz/logo.webp',
          lightUrl: 'https://aeonabot.xyz/logo.webp',
          hideName: true,
          borderRadius: false,
          alignCenter: true,
        },
      },
      index: {
        graph: {
          enabled: false,
          lineGraph: false,
          title: 'Memory Usage',
          tag: 'Memory (MB)',
          max: 100,
        },
      },
      sweetalert: {
        errors: {
          requirePremium:
            'You need to be a premium user to use this feature. Please get premium for just **$2.99** <a href="https://www.patreon.com/aeonapatreon">here</a>.',
        },
        success: {
          login: 'Successfully logged in.',
        },
      },
      meta: {
        author: 'cosmic_lonewolf',
        owner: 'cosmic_lonewolf',
        description: 'The Dashboard for Aeona Discord Bot.',
        ogLocale: 'en_US',
        ogTitle: 'Aeona Dashboard',
        ogImage: 'https://aeonabot.xyz/logo.webp',
        ogType: 'Theme',
        ogUrl: 'https://dashboard.aeonabot.xyz',
        ogSiteName: 'Soft-UI Theme',
        ogDescription: 'The Dashboard for Aeona Discord Bot.',
        twitterTitle: 'The Dashboard for Aeona Discord Bot.',
        twitterDescription: 'The Dashboard for Aeona Discord Bot.',
        twitterDomain: '',
        twitterUrl: '',
        twitterCard: '',
        twitterSite: '',
        twitterSiteId: '',
        twitterCreator: '',
        twitterCreatorId: '',
        twitterImage: 'https://aeonabot.xyz/logo.webp',
      },
      preloader: {
        image: 'https://aeonabot.xyz/logo.webp',
        spinner: true,
        text: 'Please wait...',
      },
      admin: {
        pterodactyl: {
          enabled: false,
          apiKey: '',
          panelLink: '',
          serverUUIDs: [],
        },
        logs: {
          enabled: true,
          key: process.env.apiKey,
        },
      },
      premium: {
        enabled: true,
        card: {
          title: 'Premium',
          description: 'Get Access To Premium Features For Just $2.99 Per Month',
          bgImage: 'https://aeonabot.xyz/logo.webp',
          button: {
            text: 'Get Premium',
            url: 'https://patreon.com/aeonapatreon',
          },
        },
      },

      shardspage: {
        enabled: true,
        key: process.env.apiKey!,
      },
      commands: MetadataStorage.instance.applicationCommandSlashGroups.map((group) => {
        return {
          category: group.name,
          subTitle: group.payload.description!,
          categoryId: group.name,
          image: '',
          hideDescription: false,
          hideSidebarItem: false,
          hideAlias: true,
          list: group.payload.options!.map((command) => {
            return {
              commandName: command.name,
              commandUsage: '/' + group.name + ' ' + command.name,
              commandDescription: command.description,
              commandAlias: '',
            };
          }),
        };
      }),
    }),
    settings: [getSettings(bot, ChatbotSchema, 'Chatbot')],
  });
  Dashboard.init();
}

function getSettings(
  bot: AeonaBot,
  schema: Model<{
    Guild: string;
    Channel: string;
  }>,
  name: string,
  setChannelCallback?: (channel: Channel) => unknown,
) {
  let premiumCategory = {
    categoryId: `${name}-premium`,
    categoryName: `${name} Premium`,

    categoryDescription: `Setup All The Premium Features of Aeona's ${name}`,
    premium: true,

    premiumUser: async (data: { guild: { id: string }; user: { id: string; tag: string } }) => {
      return await bot.extras.isPremium(data.guild.id);
    },
    categoryOptionsList: [{}],
  };
  premiumCategory.categoryOptionsList = [];
  for (let i = 1; i < 89; i++) {
    premiumCategory.categoryOptionsList.push({
      optionId: `${name}-premium-${i + 1}`,
      optionName: `${name} Premium`,
      optionType: DBD.formTypes.channelsSelect(false, ['GUILD_TEXT'], false, false, {}),
      getActualSet: async (data: { guild: { id: string }; user: { id: string; tag: string } }) => {
        const channels = await schema.find({
          Guild: data.guild.id,
        });

        if (!channels || channels.length == i) return;

        return channels[i].Channel;
      },
      setNew: async (data: { guild: { id: string }; user: { id: string; tag: string }; channelId: string }) => {
        const channels = await schema.find({
          Guild: data.guild.id,
        });

        if (!channels || channels.length == i) {
          new schema({
            Guild: data.guild.id,
            Channel: data.channelId,
          }).save();
        } else {
          channels[i].Channel = data.channelId;
          channels[i].save();
        }
        if (setChannelCallback) setChannelCallback(bot.channels.cache.get(data.channelId)!);
        return data.channelId;
      },
    });
  }
  return [
    {
      categoryId: `${name}-free`,
      categoryName: `${name} `,

      categoryDescription: `Setup All The Free Features of Aeona's ${name}`,

      categoryOptionsList: [
        {
          optionId: `${name}-channel`,
          optionName: `${name} Config`,

          optionType: DBD.formTypes.channelsSelect(false, ['GUILD_TEXT'], false, false, {}),
          getActualSet: async (data: { guild: { id: string }; user: { id: string; tag: string } }) => {
            const channels = await schema.find({
              Guild: data.guild.id,
            });

            if (!channels || channels.length == 0) return;

            return channels[0].Channel;
          },
          setNew: async (data: { guild: { id: string }; user: { id: string; tag: string }; channelId: string }) => {
            const channels = await schema.find({
              Guild: data.guild.id,
            });

            if (!channels || channels.length == 0) {
              new schema({
                Guild: data.guild.id,
                Channel: data.channelId,
              }).save();
            } else {
              channels[0].Channel = data.channelId;
              channels[0].save();
            }
            if (setChannelCallback) setChannelCallback(bot.channels.cache.get(data.channelId)!);
            return data.channelId;
          },
        },
      ],
    },
    premiumCategory,
  ];
}
