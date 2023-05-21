import { CategoryOptions } from '@thereallonewolf/amethystframework';

import { AeonaBot } from '../extras/index.js';

export default function (bot: AeonaBot) {
  console.log('Setting up '.cyan + 'categories'.yellow);
  const categories: CategoryOptions[] = [
    {
      name: 'afk',
      description: 'Set/List your afk.',
      uniqueCommands: false,
      default: 'set',
    },
    {
      name: 'setup',
      description: 'Configure your server. (Must See)',
      uniqueCommands: false,
      default: 'chatbot',
    },
    {
      name: 'info',
      description: 'See various informations',
      uniqueCommands: true,
      default: 'list',
    },
    {
      name: 'automod',
      description: 'Configure the automod.',
      uniqueCommands: false,
      default: 'display',
    },
    {
      name: 'autosetup',
      description: 'Automatically setup certain commands.',
      uniqueCommands: false,
      default: 'log',
    },
    {
      name: 'fun',
      description: 'Have some fun.',
      uniqueCommands: true,
      default: 'list',
    },
    {
      name: 'levels',
      description: 'Configure the rank system',
      uniqueCommands: true,
      default: 'rank',
    },
    {
      name: 'bumpreminder',
      description: 'Setup bumpreminder for your server.',
      uniqueCommands: false,
      default: 'setup',
    },
    {
      name: 'anime',
      description: 'Some anime commands',
      uniqueCommands: true,
      default: '',
    },
    {
      name: 'anime2',
      description: 'Some more anime commands',
      uniqueCommands: true,
      default: '',
    },
    {
      name: 'reactionroles',
      description: 'Setup reaction roles for your server',
      uniqueCommands: false,
      default: 'list',
    },
    {
      name: 'moderation',
      description: 'Clean your server',
      uniqueCommands: true,
      default: 'family',
    },
    {
      name: 'embed',
      description: 'Create and modify embeds.',
      uniqueCommands: true,
      default: 'setup',
    },
    {
      name: 'serverstats',
      description: 'Configure your server stats',
      uniqueCommands: true,
      default: 'list',
    },
    {
      name: 'marriage',
      description: 'Create your family',
      uniqueCommands: true,
      default: 'family',
    },
    {
      name: 'image',
      description: 'Enjoy image magic',
      uniqueCommands: true,
      default: '',
    },
    {
      name: 'announcement',
      description: 'Create/Edit your announcement.',
      uniqueCommands: false,
      default: 'create',
    },
    {
      name: 'birthdays',
      description: 'List your birthdays.',
      uniqueCommands: false,
      default: 'list',
    },
    {
      name: 'invites',
      description: 'Configure the invites system',
      uniqueCommands: false,
      default: 'show',
    },
    {
      name: 'messages',
      description: 'Configure the messages system',
      uniqueCommands: false,
      default: 'show',
    },
    {
      name: 'stickymessages',
      description: 'Configure sticky messages',
      uniqueCommands: false,
      default: 'messages',
    },
    {
      name: 'suggestions',
      description: 'Create/Deny/Accept suggestions',
      uniqueCommands: true,
      default: 'list',
    },
    {
      name: 'thanks',
      description: 'Thank users for their help',
      uniqueCommands: true,
      default: 'list',
    },
    {
      name: 'tickets',
      description: 'Various ticket commands',
      uniqueCommands: true,
      default: 'list',
    },
    {
      name: 'tools',
      description: 'Various commands to help you',
      uniqueCommands: true,
      default: '',
    },
    {
      name: 'owner',
      description: 'Private commands for the owners',
      uniqueCommands: true,
      default: '',
    },
  ];
  for (let i = 0; i < categories.length; i++) {
    bot.utils.createCategory(categories[i]);
  }
  console.log('Finished setting up '.cyan + 'categories'.yellow);
}
