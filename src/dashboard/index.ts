import { Channel, Guild, TextChannel, User } from 'discord.js';
import ChatbotSchema from '../database/models/chatbot-channel.js';
import GTNSchema from '../database/models/guessNumber.js';
import GTWSchema from '../database/models/guessWord.js';
import CountingSchema from '../database/models/countChannel.js';
import { AeonaBot } from '../utils/types.js';
import DBD from 'discord-dashboard';
import SoftUI from 'dbd-soft-ui';
import { init } from 'dbd-soft-ui/utils/initPages.js';
import { Model } from 'mongoose';
import { MetadataStorage } from 'discordx';
import fs from 'fs';
import { Components } from '../utils/components.js';

init.prototype = async function (config: any, themeConfig: any, app: any, db: any) {
  let info: any;
  if (themeConfig?.customThemeOptions?.info) info = await themeConfig.customThemeOptions.info({ config: config });

  const eventFolders = fs.readdirSync(`${__dirname}/../pages`);

  for (const folder of eventFolders) {
    const eventFiles = fs.readdirSync(`${__dirname}/../pages/${folder}`).filter((file) => file.endsWith('.js'));
    for (const file of eventFiles) {
      if(file.includes('debug')) continue;
      
      const e = require(`${__dirname}/../pages/${folder}/${file}`);
      try {
        if (folder === 'admin') {
          await app.get(e.page, async function (req: any, res: any) {
            if (!req.session) req.session = {};
            if (!req.session.user) return res.sendStatus(401);
            if (!config.ownerIDs?.includes(req.session.user.id)) return res.sendStatus(403);
            e.execute(req, res, app, config, themeConfig, info, db);
          });
        } else if (folder === 'post') {
          await app.post(e.page, function (req: any, res: any) {
            if (!req.session) req.session = {};
            e.execute(req, res, app, config, themeConfig, info, db);
          });
        } else if (folder === 'get') {
          await app.use(e.page, async function (req: any, res: any) {
            if (!req.session) req.session = {};
            e.execute(req, res, app, config, themeConfig, info, db);
          });
        }
      } catch (error) {}
    }
  }

  app.get(themeConfig.landingPage?.enabled ? '/dash' : '/', async (req: any, res: any) => {
    if (!req.session) req.session = {};
    let customThemeOptions;
    if (themeConfig?.customThemeOptions?.index) {
      customThemeOptions = await themeConfig.customThemeOptions.index({ req: req, res: res, config: config });
    }
    res.render('index', {
      req: req,
      themeConfig: req.themeConfig,
      bot: config.bot,
      customThemeOptions: customThemeOptions || {},
      config,
      require,
      feeds: (await themeConfig.storage.db.get('feeds')) || [],
    });
  });

  if (themeConfig.landingPage?.enabled)
    app.get('/', async (req: any, res: any) => {
      if (!req.session) req.session = {};
      res.setHeader('Content-Type', 'text/html');
      res.send(await themeConfig.landingPage.getLandingPage(req, res));
    });

  app.use('*', async function (req: any, res: any) {
    if (!req.session) req.session = {};
    res.status(404);
    config.errorPage(req, res, undefined, 404);
  });

  app.use((err: any, req: any, res: any, next: any) => {
    if (!req.session) req.session = {};
    res.status(500);
    config.errorPage(req, res, err, 500);
  });
};

export default async function createDashboard(bot: AeonaBot) {
  await DBD.useLicense(process.env.LICENSE!);
  DBD.Dashboard = DBD.UpdatedClass();

  const Dashboard = new DBD.Dashboard({
    port: 8081,
    client: {
      id: "931226824753700934",
      secret: process.env.CLIENT_SECRET,
    },
    acceptPrivacyPolicy: true,
    minimizedConsoleLogs: true,
    redirectUri: `https://dashboard.aeonabot.xyz/discord/callback`,
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
        //@ts-expect-error
        info: async ({ config }) => {
          return {
            useUnderMaintenance: true,
            ownerIDs: [],
            blacklistIDs: [],
            premiumCard: true,
          };
        },
        index: async ({ req, res, config }) => {
          return {
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
        noGuildIcon: 'https://www.freepnglogos.com/uploads/discord-logo-png/seven-kingdoms-9.png',
        sidebar: {
          darkUrl: 'https://aeonabot.xyz/logo.webp',
          lightUrl: 'https://aeonabot.xyz/logo.webp',
          hideName: true,
          borderRadius: false,
          alignCenter: true,
        },
      },
      locales: {
        enUS: {
          name: 'English',
          index: {
            card: {
              image: 'https://aeonabot.xyz/logo.webp',
              category: 'Aeona-index',
              title: 'Aeona Dashboard',
              description: 'The quickest and easiest way to manage Aeona',
            },
            feeds: {
              title: 'Feeds',
            }
          },
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
        ogSiteName: 'Aeona Dashboard',
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
      footer: {
        replaceDefault: true,
        text: 'Made with ❤️ by Aeona',
      },
      shardspage: {
        enabled: true,
        key: process.env.apiKey!,
      },
      commands: MetadataStorage.instance.applicationCommandSlashGroups.map((group) => {
        let commands = MetadataStorage.instance.applicationCommandSlashesFlat.filter(
          (command) => command.group === group.name,
        );
        return {
          category: group.name,
          subTitle: group.payload.description!,
          categoryId: group.name,
          image: '',
          hideDescription: false,
          hideSidebarItem: false,
          hideAlias: true,
          list: commands.map((command) => {
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
    settings: [
    //Chatbot
    ...getSettings(bot, ChatbotSchema, 'Chatbot'),
    //Guess the number
    ...getSettings(bot, GTNSchema!, 'Guess-The-Number',(channel:Channel)=>{
      bot.extras.embed(
        {
          title: `🔢 Guess the number`,
          desc: `Guess the number between **1** and **10.000**!`,
        },
        channel as unknown as TextChannel,
      );
    }),
    //Guess the word
    ...getSettings(bot, GTWSchema!, 'Guess-The-Word',(channel:Channel)=>{
      const word = 'start';
      const shuffled = word
        .split('')
        .sort(function () {
          return 0.5 - Math.random();
        })
        .join('');

      bot.extras.embed(
        {
          title: `Guess the word`,
          desc: `Put the letters in the right position!`,
          fields: [
            {
              name: `💬 Word`,
              value: `${shuffled.toLowerCase()}`,
            },
          ],
          components:new Components().addButton('Skip', 'Secondary', 'skipWord'),
        },
        channel as unknown as TextChannel,
      );
    }),

    //Counting
    ...getSettings(bot, CountingSchema!, 'Counting'),
  ],
  });
  Dashboard.init();
}

function getSettings(
  bot: AeonaBot,
  schema: Model<{
    Guild: string;
    Channel: string;
  }& any>,
  name: string,
  setChannelCallback?: (channel: Channel) => unknown,
) {
  let premiumCategory = {
    categoryId: `${name}-premium`,
    categoryName: `${name} Premium`,
    refreshOnSave: true,
    categoryDescription: `Setup All The Premium Features of Aeona's ${name}`,
    premium: true,

    premiumUser: async (data: { guild: { id: string }; user: { id: string; tag: string } }) => {
      return await bot.extras.isPremium(data.guild.id);
    },
    categoryOptionsList: [{}],
  };
  premiumCategory.categoryOptionsList = [];
  for (let i = 1; i < 8; i++) {
    
    premiumCategory.categoryOptionsList.push({
      optionId: `${name}-premium-${i + 1}`,
      optionName: `${name} Premium`,
       //@ts-expect-error
      optionType: DBD.formTypes.channelsSelect(false, [0,5,10,12,11], false, false, {}),
      getActualSet: async (data: { guild: { id: string }; user: { id: string; tag: string } }) => {

        if(!await bot.extras.isPremium(data.guild.id)) return {
          error:`You need to be a premium user to use this feature. Please get premium for just **$2.99** <a href="https://www.patreon.com/aeonapatreon">here</a>.`
        }
        const channels = await schema.find({
          Guild: data.guild.id,
        });

        if (!channels || !channels[i]) return;

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
          //@ts-expect-error
          optionType: DBD.formTypes.channelsSelect(false, [0,5,10,12,11], false, false, {}),
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
