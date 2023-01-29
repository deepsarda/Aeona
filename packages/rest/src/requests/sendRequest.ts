import { RestManager } from '@discordeno/rest';
import fetch from 'node-fetch';

import config from '../config';
import { SendRequest } from '../types';

const { REST_AUTHORIZATION } = config(['REST_AUTHORIZATION']);

export default async (data: SendRequest, rest: RestManager): Promise<unknown> => {
  if (data.Authorization !== REST_AUTHORIZATION) {
    return {
      status: 401,
      body: {
        error: 'Unauthorized',
      },
    };
  }

  const body = data.payload?.body as any;
  if (body && body.file) body.file = await (await fetch(body.file)).blob();

  const result = await rest.makeRequest(data.method, data.url, body as any).catch((e) => {
    if (e instanceof Error) {
      if (e.message.includes('[404]')) return e;
      // eslint-disable-next-line no-console
      console.log(e);
    }
    console.error(e);
    return e;
  });

  return result;
};
