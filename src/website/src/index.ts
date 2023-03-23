import { $log } from '@tsed/common';
import { PlatformExpress } from '@tsed/platform-express';
import { getServerConfig } from './Server.js';
import { AeonaBot } from '../../extras/index.js';

export async function bootstrap(bot: AeonaBot) {
  try {
    const platform = await PlatformExpress.bootstrap(getServerConfig(bot));
    await platform.listen();

    process.on('SIGINT', () => {
      platform.stop();
    });
  } catch (error) {
    $log.error({
      event: 'SERVER_BOOTSTRAP_ERROR',
      message: error.message,
      stack: error.stack,
    });

    await bootstrap(bot);
  }
}
