/* eslint-disable @typescript-eslint/no-explicit-any */
import { BASE_URL, RestManager } from 'discordeno';

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
  if (body && body.file) {
    body.file[0].blob = new Blob([Buffer.from(body.file[0].blob, 'utf-8')]);
  }
  const result = await rest
    .runMethod(rest, data.method, `${BASE_URL}/v${rest.version}/${data.url}`, body, data.options)
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
