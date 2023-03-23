import { Context, Controller, Get } from '@tsed/common';
import { View } from '@tsed/platform-views';
import { getDashboardPages } from './dashboard.js';
import { AeonaBot } from '../../../../extras/index.js';

export function getWebPages(bot: AeonaBot) {
  let commandCount = 12123;
  setInterval(async () => {
    const fluxQuery =
      'from(bucket: "Aeona") |> range(start: -1d) |> filter(fn: (r) => r["_measurement"] == "commandruncount") |> filter(fn: (r) => r["_field"] == "usage") |> filter(fn: (r) => r["action"] == "addition") |> aggregateWindow(every: 48h, fn: sum, createEmpty: false) |> yield(name: "sum")';

    const response = await bot.extras.influxQuery
      .response(fluxQuery)
      .collectRows();

    commandCount = (response[0] as any)._value as number;
  }, 2 * 60 * 1000);
  const fluxQuery =
    'from(bucket: "Aeona") |> range(start: -1d) |> filter(fn: (r) => r["_measurement"] == "commandruncount") |> filter(fn: (r) => r["_field"] == "usage") |> filter(fn: (r) => r["action"] == "addition") |> aggregateWindow(every: 48h, fn: sum, createEmpty: false) |> yield(name: "sum")';

  bot.extras.influxQuery
    .response(fluxQuery)
    .collectRows()
    .then((response) => console.log(response));

  @Controller('/')
  class Pages {
    @Get('')
    @View('index.ejs')
    async getIndex() {
      const formatter = Intl.NumberFormat('en', {
        notation: 'compact',
      });

      return {
        guilds: formatter.format(bot.extras.guildcount),
        commandsRun: commandCount,
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
