import { RestManager } from '@discordeno/rest';

import config from '../config.js';
import { SendRequest } from '../types.js';

const { REST_AUTHORIZATION } = config(['REST_AUTHORIZATION']);

export default async (
  data: SendRequest,
  rest: RestManager,
): Promise<unknown> => {
  if (data.Authorization !== REST_AUTHORIZATION) {
    return {
      status: 401,
      body: {
        error: 'Unauthorized',
      },
    };
  }

  const body: any = data.payload?.body;

  const result = await rest
    .makeRequest(data.method, data.url, body as any)
    .catch((e) => {
      if (e instanceof Error) {
        if (e.message.includes('[404]')) return e;
        // eslint-disable-next-line no-console
        console.log(e);
        return e;
      }
      console.error(e);
      return e;
    });

  return result;
};
