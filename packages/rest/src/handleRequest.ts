import { createRestManager } from '@discordeno/rest';

import config from './config.js';
import runMethod from './requests/runMethod.js';
import sendRequest from './requests/sendRequest.js';
import { RequestTypes } from './types.js';

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
