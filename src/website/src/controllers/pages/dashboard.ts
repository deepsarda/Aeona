/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BodyParams, Context, Controller, Get, PathParams, Post, QueryParams, Req } from '@tsed/common';
import { View } from '@tsed/platform-views';
import DiscordOauth2 from 'discord-oauth2';
import Permissions from '../../Permissions.js';
import crypto from 'crypto';
import GuildData from '../../../../database/models/guild.js';
import ChatbotData from '../../../../database/models/chatbot-channel.js';
import { createRestManager } from '@discordeno/rest';
import { ChannelTypes } from '@discordeno/types';
import { AeonaBot } from '../../../../extras/index.js';

export function getDashboardPages(bot: AeonaBot) {
  const oauth = new DiscordOauth2({
    clientId: process.env.ID!,
    clientSecret: bot.extras.botConfig.website.CLIENT_SECRET,
    redirectUri: bot.extras.botConfig.website.url + '/dashboard/discord/callback',
  });

  const rest = createRestManager({
    token: bot.extras.botConfig.TOKEN,
  });

  @Controller('/dashboard')
  class Dashboard {
    @Get('/')
    @View('dashboard.ejs')
    async getIndex(@Context() context: Context, @Req() req: Req) {
      const guilds = await this.getGuilds((req.session as any).user);

      if (!guilds) {
        (req.session as any).redirect = {
          url: '/dashboard',
        };
        req.session.save();

        context.response.redirect(307, '/dashboard/login');
      } else {
        return {
          guilds: guilds,
        };
      }
    }
    @Get('/guild/:id')
    @View('guilddashboard.ejs')
    async getGuildDashbord(@Context() context: Context, @Req() req: Req, @PathParams('id') id: string) {
      if (!(req.session as any).user) {
        (req.session as any).redirect = {
          url: '/dashboard/guild/' + id,
        };
        req.session.save();

        return context.response.redirect(307, '/dashboard/login');
      }

      const guild = await this.getGuild(id, (req.session as any).user);

      if (!guild) {
        (req.session as any).redirect = {
          url: '/dashboard',
        };
        req.session.save();
        context.response.redirect(307, '/dashboard/noperm');
      } else {
        let schema = await GuildData.findOne({ Guild: id });
        if (!schema)
          schema = new GuildData({
            Guild: id,
            prefix: '+',
          });

        return {
          guild,
          data: schema,
          alert: null,
          alerterror: null,
        };
      }
    }
    @Post('/guild/:id')
    @View('guilddashboard.ejs')
    async getGuildDashbordUpdate(
      @Context() context: Context,
      @Req() req: Req,
      @PathParams('id') id: string,
      @BodyParams() body: any,
    ) {
      if (!(req.session as any).user) {
        (req.session as any).redirect = {
          url: '/dashboard/guild/' + id,
        };
        req.session.save();
        return context.response.redirect(307, '/dashboard/login');
      }

      const guild = await this.getGuild(id, (req.session as any).user);

      if (!guild) {
        (req.session as any).redirect = {
          url: '/dashboard',
        };
        req.session.save();
        context.response.redirect(307, '/dashboard/noperm');
      } else {
        let schema = await GuildData.findOne({ Guild: id });
        if (!schema)
          schema = new GuildData({
            Guild: id,
            prefix: '+',
          });
        const updated: string[] = [];
        let error: null | string = null;

        if (body.prefix != schema.Prefix) {
          schema.Prefix = body.prefix;
          updated.push('prefix');
        }

        if ((body.levels == 'on') != schema.Levels) {
          schema.Levels = body.levels == 'on';
          updated.push('leveling');
        }

        if ((body.antispam == 'on') != schema.AntiSpam) {
          schema.AntiSpam = body.antispam == 'on';
          updated.push('anti spam');
        }

        if ((body.antiinvite == 'on') != schema.AntiInvite) {
          schema.AntiInvite = body.antiinvite == 'on';
          updated.push('anti invite');
        }

        if ((body.antilinks == 'on') != schema.AntiLinks) {
          schema.AntiLinks = body.antilinks == 'on';
          updated.push('anti links');
        }

        if ((body.chatbotprofane == 'on') != schema.chatbotFilter) {
          if (schema.isPremium === 'true') {
            schema.chatbotFilter = body.chatbotprofane == 'on';
            updated.push('chatbot filter');
          } else {
            error = 'This is not a premium server and hence I cannot enable chatbot swearing.';
          }
        }

        schema.save();
        return {
          guild,
          data: schema,
          alert: updated.length == 0 ? 'There was nothing to update.' : 'Updated ' + updated.join(', '),
          alerterror: error,
        };
      }
    }

    @Get('/guild/:id/chatbot')
    @View('chatbot.ejs')
    async getChatbotDashboard(@Context() context: Context, @Req() req: Req, @PathParams('id') id: string) {
      if (!(req.session as any).user) {
        (req.session as any).redirect = {
          url: '/dashboard/guild/' + id + '/chatbot',
        };
        req.session.save();
        return context.response.redirect(307, '/dashboard/login');
      }

      const guild = await this.getGuild(id, (req.session as any).user);

      if (!guild) {
        (req.session as any).redirect = {
          url: '/dashboard',
        };
        req.session.save();
        context.response.redirect(307, '/dashboard/noperm');
      } else {
        let schema = await GuildData.findOne({ Guild: id });
        if (!schema)
          schema = new GuildData({
            Guild: id,
            prefix: '+',
          });

        const chatbotSchemas: {
          Guild: string;
          Channel?: string;
        }[] = await ChatbotData.find({ Guild: id });
        const needToAdd = 8 - chatbotSchemas.length;

        if (chatbotSchemas.length < 8) for (let i = 0; i < needToAdd; i++) chatbotSchemas.push({ Guild: id });

        const channels = await rest.getChannels(id);
        const channelsFiltered = channels
          .filter((c) => c.type == ChannelTypes.GuildText)
          .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

        return {
          guild,
          channels: channelsFiltered,
          chatbot: chatbotSchemas,
          data: schema,
          alert: null,
          alerterror: null,
        };
      }
    }

    @Post('/guild/:id/chatbot')
    @View('chatbot.ejs')
    async updateChatbotDashboard(
      @Context() context: Context,
      @Req() req: Req,
      @PathParams('id') id: string,
      @BodyParams() body: any,
    ) {
      if (!(req.session as any).user) {
        (req.session as any).redirect = {
          url: '/dashboard/guild/' + id + '/chatbot',
        };
        req.session.save();
        return context.response.redirect(307, '/dashboard/login');
      }

      const guild = await this.getGuild(id, (req.session as any).user);

      if (!guild) {
        (req.session as any).redirect = {
          url: '/dashboard',
        };
        req.session.save();
        context.response.redirect(307, '/dashboard/noperm');
      } else {
        let schema = await GuildData.findOne({ Guild: id });
        if (!schema)
          schema = new GuildData({
            Guild: id,
            prefix: '+',
          });

        const chatbotSchemas = await ChatbotData.find({ Guild: id });
        const needToAdd = 8 - chatbotSchemas.length;

        if (chatbotSchemas.length < 8)
          for (let i = 0; i < needToAdd; i++) chatbotSchemas.push(new ChatbotData({ Guild: id }));

        if (schema.isPremium === 'true') {
          chatbotSchemas[0].Channel = body.chatbot1 == 'none' ? undefined : body.chatbot1;
          chatbotSchemas[1].Channel = body.chatbot2 == 'none' ? undefined : body.chatbot2;
          chatbotSchemas[2].Channel = body.chatbot3 == 'none' ? undefined : body.chatbot3;
          chatbotSchemas[3].Channel = body.chatbot4 == 'none' ? undefined : body.chatbot4;
          chatbotSchemas[4].Channel = body.chatbot5 == 'none' ? undefined : body.chatbot5;
          chatbotSchemas[5].Channel = body.chatbot6 == 'none' ? undefined : body.chatbot6;
          chatbotSchemas[6].Channel = body.chatbot7 == 'none' ? undefined : body.chatbot7;
          chatbotSchemas[7].Channel = body.chatbot8 == 'none' ? undefined : body.chatbot8;

          //save to database
          for (let i = 0; i < 8; i++) {
            chatbotSchemas[i].save();
          }
        } else {
          chatbotSchemas[0].Channel = body.chatbot1 == 'none' ? undefined : body.chatbot1;
          await chatbotSchemas[0].save();
        }

        if ((body.chatbotprofane == 'on') != schema.chatbotFilter) {
          if (schema.isPremium === 'true') {
            schema.chatbotFilter = body.chatbotprofane == 'on';
            schema.save();
          }
        }
        const channels = await rest.getChannels(id);
        const channelsFiltered = channels
          .filter((c) => c.type == ChannelTypes.GuildText)
          .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

        return {
          guild,
          channels: channelsFiltered,
          chatbot: chatbotSchemas,
          data: schema,
          alert: 'Sucessfully updated chatbot channels.',
          alerterror: null,
        };
      }
    }

    @Get('/noperms')
    async noperms() {
      return 'You do not have permission to do that.';
    }
    @Get('/noperm')
    async noperm() {
      return 'You do not have permission to do that.';
    }
    @Get('/login')
    async login(@Context() context: Context) {
      context.response.redirect(
        301,
        oauth.generateAuthUrl({
          scope: ['identify', 'guilds'],
          state: crypto.randomBytes(16).toString('hex'),
        }),
      );
    }

    @Get('/discord/callback')
    async callback(@Context() context: Context, @QueryParams('code') code: string, @Req() req: Req) {
      const access = await oauth.tokenRequest({
        scope: ['identify', 'guilds'],
        code: code,
        grantType: 'authorization_code',
      });
      const u = await oauth.getUser(access.access_token);
      (req.session as any).user = { token: access.access_token, user: u };
      req.session.save();
      if ((req.session as any).redirect) context.response.redirect(307, (req.session as any).redirect.url);
      else context.response.redirect(307, '/dashboard');
    }

    async getGuilds(user: undefined | { token: string }) {
      if (!user) return false;

      const g = await oauth.getUserGuilds(user.token);

      const guilds: {
        id: string;
        name: string;
        icon: string | null | undefined;
        owner?: boolean;
        permissions?: number;
        features: string[];
        permissions_new?: string;
      }[] = [];

      for (let i = 0; i < g.length; i++) {
        if (new Permissions(g[i].permissions ? BigInt(g[i].permissions!) : undefined).has('MANAGE_GUILD'))
          guilds.push(g[i]);
      }

      return guilds;
    }

    async getGuild(id: string, user: undefined | { token: string }) {
      const guilds = await this.getGuilds(user);
      if (!guilds) return false;

      let guild:
        | false
        | {
            id: string;
            name: string;
            icon: string | null | undefined;
            owner?: boolean;
            permissions?: number;
            features: string[];
            permissions_new?: string;
          } = false;

      for (let i = 0; i < guilds.length; i++) if (guilds[i].id == id) guild = guilds[i];
      try {
        if (guild) return await rest.getGuild(guild.id);
      } catch (e) {
        //prevent lint error
      }
      return false;
    }
  }

  return Dashboard;
}
