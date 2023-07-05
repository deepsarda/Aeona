import fs from 'node:fs';
import { BotConfig } from './types.js';

// Array to store bot configurations
export const configs: BotConfig[] = [];

// Read the files in the configs directory and parse them
const files = fs.readdirSync(process.cwd() + '/configs');
for (const file of files) {
  // Exclude files with 'example.json' suffix
  if (!file.endsWith('example.json')) {
    // Read the file contents and parse it as JSON, then push it to the configs array
    configs.push(JSON.parse(fs.readFileSync(process.cwd() + '/configs/' + file).toString()));
  }
}

/**
 * Get the configuration for a bot by name or token
 * @param nameOrToken - The name or token of the bot
 * @returns The bot configuration object, if found
 */
export function getConfig(nameOrToken: string): BotConfig | undefined {
  return configs.find((config) => config.token === nameOrToken || config.name === nameOrToken);
}

/**
 * Get a list of bot names that have a specific plugin enabled
 * @param pluginname - The name of the plugin
 * @returns An array of bot names
 */
export function getPluginsBot(pluginname: string): string[] {
  const botNames = configs
    // Filter out configurations that have the plugin disabled
    .filter((config) => !config.disabledPlugins.includes(pluginname.toLowerCase()))
    // Map the remaining configurations to their respective names
    .map((config) => config.name);
  // Add the lowercase plugin name to the array
  botNames.push(pluginname.toLowerCase());
  return botNames;
}
