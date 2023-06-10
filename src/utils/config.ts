import fs from 'node:fs';
import { BotConfig } from './types.js';

export const configs: BotConfig[] = [];

const files = fs.readdirSync(process.cwd() + '/configs');
for (const file of files) {
  if (!file.endsWith('example.json')) {
    configs.push(JSON.parse(fs.readFileSync(process.cwd() + '/configs/' + file).toString()));
  }
}

export function getConfig(nameOrToken: string) {
  return configs.find((config) => config.token === nameOrToken || config.name === nameOrToken);
}

export function getPluginsBot(pluginname: string) {
  return configs
    .filter((config) => !config.disabledPlugins.includes(pluginname.toLowerCase()))
    ?.map((config) => config.name);
}
