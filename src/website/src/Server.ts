import { Configuration, Inject } from '@tsed/di';
import { PlatformApplication } from '@tsed/common';
import '@tsed/platform-express'; // /!\ keep this import
import '@tsed/ajv';
import { config } from './config/index.js';
import { getWebPages } from './controllers/pages/index.js';
import session from 'express-session';
import { AeonaBot } from '../../extras/index.js';
import crypto from 'crypto';
export function getServerConfig(bot: AeonaBot) {
  @Configuration({
    ...config,
    acceptMimes: ['application/json'],
    httpPort: bot.extras.botConfig.website.port,
    httpsPort: false, // CHANGE
    disableComponentsScan: true,
    mount: {
      '/': [...Object.values(getWebPages(bot))],
    },
    middlewares: [
      'cors',
      'cookie-parser',
      'compression',
      'method-override',
      'json-parser',
      { use: 'urlencoded-parser', options: { extended: true } },
    ],
    views: {
      root: process.cwd() + '/src/website/views',
      viewEngine: 'ejs',
      options: {
        ejs: {
          options: {
            name: 'Aeona',
            url: '',
            alert: null,
            alerterror: null,
          },
        }, // global options for ejs engine. See official engine documentation for more details.
      },
    },
    statics: {
      '/': [process.cwd() + '/src/website/public'],
    },
    exclude: ['**/*.spec.ts'],
  })
  class Server {
    @Inject()
    protected app: PlatformApplication;

    @Configuration()
    protected settings: Configuration;
    public $beforeRoutesInit(): void | Promise<any> {
      this.app.getApp().set('trust proxy', 1); // trust first proxy
      this.app.use(
        session({
          secret: crypto.randomInt(1, 30).toString() + 'adasdasdqwe',
          resave: true,
          saveUninitialized: true,
          cookie: { secure: false },
        }),
      );
    }
  }

  return Server;
}
