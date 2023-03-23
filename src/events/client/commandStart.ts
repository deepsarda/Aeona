import { Point } from '@influxdata/influxdb-client';
import { CommandClass } from '@thereallonewolf/amethystframework';
import { Interaction, Message } from 'discordeno/transformers';

import { AeonaBot } from '../../extras/index.js';

export default async (
  bot: AeonaBot,
  command: CommandClass,
  data: Interaction | Message,
) => {
  bot.extras.influx?.writePoint(
    new Point('commandruncount').tag('action', 'addition').intField('usage', 1),
  );
  bot.extras.influx?.writePoint(
    new Point('commands')
      .tag('action', 'addition')
      .tag('command', command.name)
      .intField('value', 1),
  );

  console.log(
    `BOT`.blue.bold,
    `>>`.white,
    `Command Run: `.red,
    command.name.yellow,
    (data as unknown as Interaction).data
      ? 'Command ran using slash command'.green
      : 'command ran using normal commands'.green,
  );
};
