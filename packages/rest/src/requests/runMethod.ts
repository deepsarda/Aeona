import { RestManager } from '@discordeno/rest';
import { BASE_URL } from 'discordeno';
import fetch from 'node-fetch';

import config from '../config';
import { RunMethod } from '../types';

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
  const body = data.body ? JSON.parse(data.body as any) : undefined;
  if (body && body.file) body.file = await (await fetch(body.file)).blob();
  console.log(`${BASE_URL}/v${rest.version}${data.url}`);
  const result = await rest
    .makeRequest(data.method, `${BASE_URL}/v${rest.version}${data.url}`, body, data.options)
    .catch((e) => {
      if (e instanceof Error) {
        if (e.message.includes('[404]')) return e;
        // eslint-disable-next-line no-console
        console.log(e);
      }
      return e;
    });

  return result;
};
