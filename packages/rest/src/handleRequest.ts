import { createRestManager } from 'discordeno/rest';

import config from './config.js';
import runMethod from './requests/runMethod.js';
import sendRequest from './requests/sendRequest.js';
import { RequestTypes } from './types.js';

const { DISCORD_TOKEN, REST_AUTHORIZATION } = config([
  'DISCORD_TOKEN',
  'REST_AUTHORIZATION',
]);

let rest = createRestManager({
  token: DISCORD_TOKEN,
  secretKey: REST_AUTHORIZATION,

  debug: (s) => {
    // if (!s.includes('processRateLimitedPaths')) console.log(s);
  },
});
setInterval(() => {
  rest = createRestManager({
    token: DISCORD_TOKEN,
    secretKey: REST_AUTHORIZATION,

    debug: (s) => {
      // if (!s.includes('processRateLimitedPaths')) console.log(s);
    },
  });
}, 1000 * 60 * 60);
const handleRequest = async (req: RequestTypes): Promise<unknown> => {
  switch (req.type) {
    case 'RUN_METHOD':
      return runMethod(req.data, rest);
    case 'SEND_REQUEST':
      return sendRequest(req.data, rest);
  }
};

export { handleRequest };
