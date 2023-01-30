import fs from 'fs';

import { AeonaBot } from '../extras/index.js';

export default async function (bot: AeonaBot) {
  console.log('Loading '.cyan + 'handlers'.yellow);
  let dirs = fs.readdirSync('./dist/handlers/');
  for (let i = 0; i < dirs.length; i++) {
    const dir = dirs[i];
    const dirs1 = fs.readdirSync(`./dist/handlers/${dir}`);

    for (let j = 0; j < dirs1.length; j++) {
      const a = await import(`../handlers/${dir}/${dirs1[j]}`);

      a.default(bot);
    }
  }
  console.log('Loaded '.cyan + 'handlers'.yellow);
  console.log('Loading '.cyan + 'events'.yellow);
  dirs = fs.readdirSync('./dist/events/');
  for (let i = 0; i < dirs.length; i++) {
    const dir = dirs[i];
    const dirs1 = fs.readdirSync(`./dist/events/${dir}`);

    for (let j = 0; j < dirs1.length; j++) {
      const a = await import(`../events/${dir}/${dirs1[j]}`);

      bot.on(dirs1[j].split('.')[0]!, a.default);
    }
  }
  console.log('Loaded '.cyan + 'events'.yellow);
  console.log('Loading '.cyan + 'commands'.yellow);
  dirs = fs.readdirSync('./dist/commands/');
  for (let i = 0; i < dirs.length; i++) {
    const dir = dirs[i];
    const dirs1 = fs.readdirSync(`./dist/commands/${dir}`);

    for (let j = 0; j < dirs1.length; j++) {
      const a = await import(`../commands/${dir}/${dirs1[j]}`);

      bot.amethystUtils.createCommand(a.default);
    }
  }
  console.log('Loaded '.cyan + 'commands'.yellow);
}
