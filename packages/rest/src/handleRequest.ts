import { createRestManager } from '@discordeno/rest';

import config from './config';
import runMethod from './requests/runMethod';
import sendRequest from './requests/sendRequest';
import { RequestTypes } from './types';

const { DISCORD_TOKEN } = config(['DISCORD_TOKEN']);

const rest = createRestManager({
  token: DISCORD_TOKEN,
});

const handleRequest = async (req: RequestTypes): Promise<unknown> => {
  switch (req.type) {
    case 'RUN_METHOD':
      return runMethod(req.data, rest);
    case 'SEND_REQUEST':
      return sendRequest(req.data, rest);
  }
};
export { handleRequest };
