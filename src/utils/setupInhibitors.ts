import { AmethystError, ErrorEnums } from "@thereallonewolf/amethystframework";
import fetch from "node-fetch";
import Banned from "../database/models/banned.js";
import GuildDB from "../database/models/guild.js";
import { AeonaBot } from "../extras/index.js";

export default function (bot: AeonaBot) {
  console.log("Setting up ".cyan + "inhibitors".yellow);
  bot.inhibitors.set(
    "upvoteonly",
    async (b, command, options): Promise<true | AmethystError> => {
      if (command.extras.upvoteOnly) {
        if (options && options.guildId) {
          let guildDB = await GuildDB.findOne({
            Guild: `${options.guildId}`,
          });
          if (!guildDB)
            guildDB = new GuildDB({
              Guild: `${options.guildId}`,
            });
          if (guildDB.isPremium === "true") return true;
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
              }
            );
            clearTimeout(timeoutId);
            const json: any = await response.json();
            if (json.voted == 1) return true;
            return {
              // @ts-ignore
              type: ErrorEnums.OTHER,
              value:
                "You need to upvote me at https://top.gg/bot/931226824753700934/vote to use this command. \n **or** \n **You can skip upvoting by** getting premium for just **$2.99** at https://patreon.com/aeonicdiscord \n **or** \n *boost our support server*. \n Use `+perks` to see all the perks of premium.",
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
            "You need to upvote me at https://top.gg/bot/931226824753700934/vote to use this command. \n **or** \n **You can skip upvoting by** getting premium for just **$2.99** at https://patreon.com/aeonicdiscord \n **or** \n *boost our support server*. \n Use `+perks` to see all the perks of premium.",
        };
      }
      return true;
    }
  );

  bot.inhibitors.set(
    "banned",
    async (b, command, options): Promise<true | AmethystError> => {
      const bannedUser = await Banned.findOne({
        ID: `${options.user!.id}`,
      });
      if (bannedUser)
        return {
          //@ts-ignore
          type: ErrorEnums.OTHER,
          value: "You have been banned from this bot.",
        };

      const bannedServer = await Banned.findOne({
        ID: `${options.guildId}`,
      });
      if (bannedServer)
        return {
          //@ts-ignore
          type: ErrorEnums.OTHER,
          value: "This server has been banned from this bot.",
        };
      return true;
    }
  );

  console.log("Finished setting up ".cyan + "inhibitors".yellow);
}
