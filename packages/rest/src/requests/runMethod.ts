import { RestManager } from '@discordeno/rest';
import { BASE_URL } from 'discordeno';

import config from '../config.js';
import { RunMethod } from '../types.js';

const { REST_AUTHORIZATION } = config(['REST_AUTHORIZATION']);

export default async (data: RunMethod, rest: RestManager): Promise<unknown> => {
  if (data.Authorization !== REST_AUTHORIZATION) {
    return {
      status: 401,
      body: {
        error: 'Unauthorized',
      },
    };
  }

  const body = data.body ? (data.body as any) : undefined;
  
  const result = await rest
    .makeRequest(
      data.method,
      `${BASE_URL}/v${rest.version}${data.url}`,
      body,
      data.options,
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
