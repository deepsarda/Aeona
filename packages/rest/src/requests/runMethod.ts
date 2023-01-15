/* eslint-disable @typescript-eslint/no-explicit-any */
import { BASE_URL, RestManager } from 'discordeno';
import { Blob } from 'node:buffer';

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

  if (data.body && (data.body as any)?.file != undefined) {
    (data.body as any).file[0].blob = new Blob(
      [Buffer.from(((data.body as any).file[0].blob as any).file[0].blob, 'base64')],
      {
        encoding: 'base64',
      },
    );
    console.log(data.body);
  }

  const result = await rest
    .runMethod(
      rest,
      data.method,
      `${BASE_URL}/v${rest.version}/${data.url}`,
      data.body,
      data.options,
    )
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
