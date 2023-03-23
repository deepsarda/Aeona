import { createRestManager } from '@discordeno/rest';
import { AeonaBot } from '../extras/index.js';
import { BASE_URL } from 'discordeno';

const setupRest = async (bot: AeonaBot, DISCORD_TOKEN: string) => {
  const rest = createRestManager({
    token: DISCORD_TOKEN,
  });

  bot.rest.runMethod = async (
    r,
    method,
    route,
    body,
    options,
  ): Promise<any> => {
    const result = await rest
      .makeRequest(
        method,
        `${BASE_URL}/v${rest.version}${route}`,
        body,
        options,
      )
      .catch((e) => {
        if (e instanceof Error) {
          if (e.message.includes('[404]')) return e;
          // eslint-disable-next-line no-console
          return e;
        }
        console.error(e);
        return e;
      });
    return result;
  };

  bot.rest.sendRequest = async (r, options): Promise<any> => {
    const result = await rest
      //@ts-ignore
      .makeRequest(options.method, options.url, options.payload?.body)
      .catch((e) => {
        if (e instanceof Error) {
          if (e.message.includes('[404]')) return e;
          // eslint-disable-next-line no-console
          return e;
        }
        console.error(e);
        return e;
      });
    return result;
  };
};

export { setupRest };
