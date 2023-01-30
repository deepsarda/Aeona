import { AeonaBot } from '../extras/index.js';

const logger = {
  debug: (...args: unknown[]): void => {
    if (process.env.NODE_ENV === 'DEVELOPMENT') console.debug(...args);
  },

  error: (...args: unknown[]): void => {
    console.error(...args);
  },

  info: (...args: unknown[]): void => {
    if (process.env.TESTING) return;
    console.info(...args);
  },

  panic: (...args: unknown[]): void => {
    console.error(...args);
    process.exit(1);
  },
};

export { logger };

export const setupLogging = (bot: AeonaBot) => {
  /* eslint-disable no-console */
  let content = '';
  const builtins = {
    log: console.log,
    warn: console.warn,
    error: console.error,
  };
  // eslint-disable-next-line
  for (const printFunction in builtins) {
    console[printFunction] = function () {
      // eslint-disable-next-line prefer-rest-params
      builtins[printFunction].apply(console, [...arguments]);
      try {
        // eslint-disable-next-line prefer-rest-params
        const message = [...arguments]
          .reduce((accumulator, current) => `${accumulator} ${current} `, '')
          .replace(/\s+$/, '');

        content += `\n${
          printFunction == 'log' ? '+ ' : printFunction == 'error' ? '- ' : ''
        }${message.replace(
          // eslint-disable-next-line no-control-regex
          /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
          '',
        )}`;

        if (content.length > 300) {
          bot.helpers.sendMessage('1063124831211630622', {
            content: `\`\`\`diff\n${content}\n \`\`\``,
          });
          content = '';
        }
      } catch (e) {
        console.error(e);
      }
    };
  }
};
