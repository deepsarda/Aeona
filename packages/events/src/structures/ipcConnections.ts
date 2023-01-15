import { DiscordGatewayPayload } from 'discordeno/types';
import { Client } from 'net-ipc';

import { AeonaBot } from '../extras/index.js';
import { getEnviroments } from '../utils/getEnviroments.js';
import { logger } from '../utils/logger.js';

let eventsClient: Client;
let retries = 0;

const createIpcConnections = async (bot: AeonaBot): Promise<Client> => {
  const { REST_SOCKET_PATH, EVENT_SOCKET_PATH } = getEnviroments([
    'REST_SOCKET_PATH',
    'EVENT_SOCKET_PATH',
  ]);

  logger.info(
    `Creating IPC connections to REST ${REST_SOCKET_PATH} and EVENTS ${EVENT_SOCKET_PATH}`,
  );

  const restClient = new Client({ path: REST_SOCKET_PATH, port: 8123 });
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

  eventsClient.on('message', (msg: { data: DiscordGatewayPayload; shardId: number }) => {
    if (!msg.data.t) return;

    if (msg.data.t !== 'RESUMED') bot.handlers[msg.data.t]?.(bot, msg.data, msg.shardId);
  });

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

  return restClient;
};

export const getEventsClient = (): Client => eventsClient;

export { createIpcConnections };
