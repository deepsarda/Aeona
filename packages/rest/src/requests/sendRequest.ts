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

  const body: any = JSON.parse(data.payload?.body as any);

  const result = await rest
    .makeRequest(data.method, data.url, body as any)
    .catch((e) => {
      if (e instanceof Error) {
        if (e.message.includes('[404]')) return e;
        // eslint-disable-next-line no-console
        console.log('Send Request');
        console.error(e);
        return e;
      }
      console.log('Send Request');
      console.log(body);
      console.error(e);
      return e;
    });

  return result;
};
