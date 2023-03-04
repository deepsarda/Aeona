import { createRestManager, RestManager } from 'discordeno/rest';
import { DiscordGatewayPayload } from 'discordeno/types';
import { Client } from 'net-ipc';

import { AeonaBot } from '../extras/index.js';
import { getEnviroments } from './getEnviroments.js';
import { logger } from './logger.js';

let eventsClient: Client;
let retries = 0;

const createIpcConnections = async (
  bot: AeonaBot,
  DISCORD_TOKEN: string,
  REST_AUTHORIZATION: string,
): Promise<Client> => {
  const { REST_SOCKET_PATH, EVENT_SOCKET_PATH } = getEnviroments([
    'REST_SOCKET_PATH',
    'EVENT_SOCKET_PATH',
  ]);

  logger.info(
    `Creating IPC connections to REST ${REST_SOCKET_PATH} and EVENTS ${EVENT_SOCKET_PATH}`,
  );

  const restClient = new Client({ path: REST_SOCKET_PATH, port: 20000 });
  eventsClient = new Client({ path: EVENT_SOCKET_PATH });

  eventsClient.on('close', () => {
    logger.info('[GATEWAY] Gateway client closed');

    const reconnectLogic = () => {
      logger.info('[GATEWAY] Trying to reconnect to gateway server');
      eventsClient.connect().catch(() => {
        setTimeout(reconnectLogic, 1000);

        logger.info(`[GATEWAY] Fail when reconnecting... ${retries} retries`);

        if (retries >= 5) {
          logger.info(`[GATEWAY] Couldn't reconnect to gateway server.`);
          process.exit(1);
        }

        retries += 1;
      });
    };

    setTimeout(reconnectLogic, 2000);
  });

  eventsClient.on('ready', () => {
    logger.info('[GATEWAY] Gateway IPC connected');
    retries = 0;

    eventsClient.send({ type: 'IDENTIFY', version: process.env.VERSION });
  });

  restClient.on('close', () => {
    logger.info('[REST] REST Client closed');
    process.exit(1);
  });

  restClient.on('ready', () => {
    logger.info('[REST] REST IPC connected');

    restClient.send({ type: 'IDENTIFY', package: 'EVENTS', id: process.pid });
  });

  eventsClient.on(
    'message',
    (msg: { data: DiscordGatewayPayload; shardId: number }) => {
      if (!msg.data.t) return;
      if (msg.data.t !== 'RESUMED')
        bot.handlers[msg.data.t]?.(bot, msg.data, msg.shardId);
    },
  );

  eventsClient.on('request', async (msg, ack) => {
    switch (msg.type) {
      case 'YOU_ARE_THE_MASTER': {
        ack(process.pid);
        logger.info('[Bot] Made master.');
        bot.emit('ready', bot, {}, {});
        break;
      }
      case 'REQUEST_TO_SHUTDOWN': {
        logger.info('Gateway asked for a shutdown of this instance');

        await ack(process.pid);
        await eventsClient.close('REQUESTED_SHUTDOWN');
        await restClient.close('REQUESTED_SHUTDOWN');
        process.exit(0);
      }
    }
  });

  if (process.env.TESTING) return restClient;

  await restClient
    .connect()
    .catch(logger.panic)
    .then(() => logger.info('[BOT] Connected to rest.'));

  await eventsClient
    .connect()
    .catch(logger.panic)
    .then(() => logger.info('[BOT] Connected to gateway.'));

  logger.info('Setting up the custom rest manager');
  const rest2 = createRestManager({
    token: DISCORD_TOKEN,
  })
  const runMethod = async <T = any>(
    client: Client,
    rest: RestManager,
    method: RequestMethod,
    route: string,
    body?: unknown,
    options?: {
      retryCount?: number;
      bucketId?: string;
      headers?: Record<string, string>;
    },
  ): Promise<T> => {
    if (body && (body as any).file) {
      return await rest2.runMethod(rest2, method, route, body, options);
    }

    const response = await client.request(
      {
        type: 'RUN_METHOD',
        data: {
          Authorization: rest.secretKey,
          url: route,
          body: body,
          method,
          options,
        },
      },
      0,
    );

    if (response?.statusCode >= 400)
      logger.error(`[${response.status}] - ${response.error}`);
    return response;
  };

  type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

  const sendRequest = async <T = any>(
    client: Client,
    rest: RestManager,
    method: RequestMethod,
    route: string,
    bucketId?: string,
    retryCount?: number,
    payload?: {
      headers: Record<string, string>;
      body: unknown;
    },
  ): Promise<T> => {
    const response = await client.request(
      {
        type: 'SEND_REQUEST',
        data: {
          Authorization: rest.secretKey,
          url: route,
          method,
          bucketId,
          retryCount,
          payload,
        },
      },
      0,
    );

    if (response?.statusCode >= 400)
      logger.error(`[${response.status}] - ${response.error}`);

    return response;
  };

  bot.rest = createRestManager({
    token: DISCORD_TOKEN,
    secretKey: REST_AUTHORIZATION,
    runMethod: async (rest, method, route, body, options) =>
      runMethod(restClient, rest, method, route, body, options),
    sendRequest: async (rest, options) =>
      sendRequest(
        restClient,
        rest,
        options.method,
        options.url,
        options.bucketId,
        options.retryCount,
        options.payload,
      ),
  });

  logger.info('[READY] Events are being processed!');

  return restClient;
};

export const getEventsClient = (): Client => eventsClient;

export { createIpcConnections };
