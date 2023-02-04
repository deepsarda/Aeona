import { AmethystError, ErrorEnums } from '@thereallonewolf/amethystframework';
import fetch from 'node-fetch';

import Functions from '../database/models/functions.js';
import { AeonaBot } from '../extras/index.js';

export default function (bot: AeonaBot) {
  console.log('Setting up '.cyan + 'inhibitors'.yellow);
  bot.inhibitors.set(
    'upvoteonly',
    async (b, command, options): Promise<true | AmethystError> => {
      if (command.extras.upvoteOnly) {
        if (options && options.guildId) {
          let guildDB = await Functions.findOne({
            Guild: `${options.guildId}`,
          });
          if (!guildDB)
            guildDB = new Functions({
              Guild: `${options.guildId}`,
            });
          if (guildDB.isPremium === 'true') return true;
        }
        try {
          if (process.env.TOPGG_TOKEN) {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            const response = await fetch(
              `https://top.gg/api/bots/${bot.user.id}/check?userId=${
                options?.author!.id
              }`,
              {
                signal: controller.signal,
                headers: {
                  authorization: process.env.TOPGG_TOKEN,
                },
              },
            );
            clearTimeout(timeoutId);
            const json: any = await response.json();
            if (json.voted == 1) return true;
            return {
              // @ts-ignore
              type: ErrorEnums.OTHER,
              value:
                'You need to upvote me at https://top.gg/bot/931226824753700934/vote to use this command. \n Or \n __Get premium for 1 month for this server for just $1 at https://patreon.com/aeonicdiscord __ and remove all ads.',
            };
          }
        } catch (e) {
          console.log(`Error in upvote:${e}`);
          return true;
        }

        return {
          //@ts-ignore
          type: ErrorEnums.OTHER,
          value:
            'You need to upvote me at https://top.gg/bot/931226824753700934/vote to use this command. \n Or \n __Get premium for 1 month for this server for just $1 at https://patreon.com/aeonicdiscord __ and remove all ads.',
        };
      }
      return true;
    },
  );
  console.log('Finished setting up '.cyan + 'inhibitors'.yellow);
}
