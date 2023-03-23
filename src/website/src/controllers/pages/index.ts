import { Context, Controller, Get } from '@tsed/common';
import { View } from '@tsed/platform-views';
import { getDashboardPages } from './dashboard.js';
import { AeonaBot } from '../../../../extras/index.js';

export function getWebPages(bot: AeonaBot) {
  @Controller('/')
  class Pages {
    @Get('')
    @View('index.ejs')
    async getIndex() {
      const formatter = Intl.NumberFormat('en', {
        notation: 'compact',
      });
      const fluxQuery =
        'from(bucket: "Aeona") |> range(start: -24hr) |> filter(fn: (r) => r["_measurement"] == "commandruncount") |> filter(fn: (r) => r["_field"] == "usage") |> filter(fn: (r) => r["action"] == "addition") |> aggregateWindow(every: 48h, fn: sum, createEmpty: false) |> yield(name: "sum")';

      const response = await bot.extras.influxQuery
        .response(fluxQuery)
        .collectRows();
      return {
        guilds: formatter.format(bot.extras.guildcount),
        commandsRun: response[0],
        guildsUnformatted: bot.extras.guildcount,
      };
    }
    @Get('/premium')
    @View('premium.ejs')
    async getPremium() {
      return {};
    }
    @Get('/privacy-policy')
    @View('privacy-policy.ejs')
    async getPrivacy() {
      return {};
    }

    @Get('/invite')
    async getInvite(@Context() context: Context) {
      context.response.redirect(
        307,
        'https://discord.com/oauth2/authorize?client_id=931226824753700934&scope=bot&PermissionsBitField=8',
      );
    }

    @Get('/support')
    async getSupport(@Context() context: Context) {
      context.response.redirect(307, 'https://discord.gg/W8hssA32C9');
    }
  }
  return [Pages, getDashboardPages(bot)];
}
