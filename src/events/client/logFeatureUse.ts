import { Point } from '@influxdata/influxdb-client';
import { AeonaBot } from '../../extras/index.js';

export default async (bot: AeonaBot, command: string) => {
  bot.extras.influx?.writePoint(
    new Point('commandruncount').tag('action', 'addition').intField('usage', 1),
  );
  bot.extras.influx?.writePoint(
    new Point('commands')
      .tag('action', 'addition')
      .tag('command', command)
      .intField('value', 1),
  );

  console.log(
    `BOT`.blue.bold,
    `>>`.white,
    `Function Used `.red,
    command.yellow,
  );
};
