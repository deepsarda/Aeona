import {
  AmethystBot,
  AmethystCollection,
  Components,
  Context,
} from '@thereallonewolf/amethystframework';
import { Channel, Role, VoiceState } from 'discordeno';
import { BigString } from 'discordeno/types';
import { Manager } from 'erela.js';
import AppleMusic from 'erela.js-apple';
import Deezer from 'erela.js-deezer';
import Facebook from 'erela.js-facebook';
import Spotify from 'erela.js-spotify';

import botConfig from '../botconfig/bot.js';
import levels from '../database/models/levels.js';
import Schema from '../database/models/logChannels.js';
import Stats from '../database/models/stats.js';
import ticketChannels from '../database/models/ticketChannels.js';
import ticketSchema from '../database/models/tickets.js';
import { createTranscript } from '../transcripts/index.js';
import embeds from './embed.js';

export interface AeonaBot extends AmethystBot {
  extras: ReturnType<typeof additionalProps>;
}

const parts = process.env.WEBHOOKURL!.split('/');
const token = parts.pop() || '';
const id = parts.pop();
export function additionalProps(client: AeonaBot) {
  return {
    ...embeds(client),
    version: 'v0.1.7',
    webhook: async (content: any) => {
      return await client.helpers.sendWebhookMessage(id as BigString, token, content);
    },
    startTime: new Date().getTime(),
    config: botConfig,
    colors: botConfig.colors,
    emotes: botConfig.emotes,
    messageCount: 0,
    lastguildcount: 0,
    ready: false,
    playerManager: new Map(),
    triviaManager: new Map(),
    queue: new Map(),
    voiceStates: new AmethystCollection<string, VoiceState>(),
    player: new Manager({
      plugins: [
        // @ts-ignore
        new AppleMusic({}),
        new Deezer({}),
        new Facebook(),
        new Spotify({
          clientID: process.env.SPOTIFY_CLIENT_ID!,
          clientSecret: process.env.SPOTIFY_CLIENT_SECERT!,
          playlistLimit: 100,
          albumLimit: 100,
        }),
      ],
      nodes: [
        {
          host: 'node1.kartadharta.xyz',
          port: 443,
          password: 'kdlavalink',
          secure: true,
        },
      ],
      send(id, payload) {
        const guild = client.cache.guilds.memory.get(BigInt(id));
        if (guild) client.gateway.manager.shards.get(guild.shardId)?.send(payload);
      },
    }),
    capitalizeFirstLetter: (string: string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    buttonReactions(id: any, reactions: any[]) {
      const comp = new Components();
      for (const reaction of reactions) {
        comp.addButton('', 'Secondary', `reaction_button-${reaction}`, {
          emoji: `${reaction}`,
        });
      }

      return comp;
    },
    async getLogs(guildId: any) {
      const data = await Schema.findOne({ Guild: guildId });
      if (data && data.Channel) {
        const channel = await client.helpers.getChannel(BigInt(data.Channel));
        return channel;
      }
      return false;
    },
    async createChannelSetup(Schema: any, channel: Channel, interaction: Context) {
      Schema.findOne(
        { Guild: interaction.guildId },
        async (err: any, data: { Channel: bigint; save: () => void }) => {
          if (data) {
            data.Channel = channel.id;
            data.save();
          } else {
            new Schema({
              Guild: interaction.guildId,
              Channel: `${channel.id}`,
            }).save();
          }
        },
      );

      client.extras.embed(
        {
          title: 'Successful!',
          desc: `Channel has been set up successfully!`,
          fields: [
            {
              name: `<:channel:1049292166343688192> Channel`,
              value: `<#${channel.id}> (${channel.id})`,
            },
          ],
          type: 'reply',
        },
        interaction,
      );
    },
    async createRoleSetup(Schema: any, role: Role, interaction: Context) {
      Schema.findOne(
        { Guild: interaction.guildId },
        async (err: any, data: { Role: bigint; save: () => void }) => {
          if (data) {
            data.Role = role.id;
            data.save();
          } else {
            new Schema({
              Guild: interaction.guildId,
              Role: `${role.id}`,
            }).save();
          }
        },
      );

      client.extras.embed(
        {
          title: `Successful`,
          desc: `Role has been set up successfully!`,
          fields: [
            {
              name: `<:role:1062978537436491776> Role`,
              value: `<@&${role.id}> (${role.id})`,
            },
          ],
          type: 'reply',
        },
        interaction,
      );
    },
    async generateEmbed(start: any, end: number, lb: any[], title: any) {
      const current = lb.slice(start, end + 10);
      const result = current.join('\n');

      const embed = client.extras
        .templateEmbed()
        .setTitle(`${title}`)
        .setDescription(`${result.toString()}`);

      return embed;
    },

    async createLeaderboard(title: any, lb: any[], interaction: Context, currentIndex?: number) {
      if (!currentIndex) currentIndex = 0;
      let btn1 = true;
      let btn2 = true;

      if (currentIndex !== 0) btn1 = false;
      if (currentIndex + 10 < lb.length) btn2 = false;
      const comp = new Components()
        .addButton('Previous', 'Secondary', 'back_button', {
          emoji: '1049292169535561819',
          disabled: btn1,
        })
        .addButton('Next', 'Secondary', 'forward_button', {
          emoji: '1049292172479955024',
          disabled: btn2,
        });
      const msg = await client.helpers.sendMessage(interaction.channel!.id, {
        embeds: [await client.extras.generateEmbed(currentIndex, currentIndex, lb, title)],
        components: comp,
      });

      if (lb.length <= 10) return;
      client.amethystUtils

        .awaitComponent(msg.id, {
          timeout: 60_000,
          type: 'Button',
        })
        .then(async (btn) => {
          if (!currentIndex) return;

          btn.data?.customId === 'back_button' ? (currentIndex -= 10) : (currentIndex += 10);
          client.extras.createLeaderboard(title, lb, interaction, currentIndex);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    getTemplate: async (guild: bigint) => {
      try {
        const data = await Stats.findOne({ Guild: guild });

        if (data && data.ChannelTemplate) {
          return data.ChannelTemplate;
        }
        return `{emoji} {name}`;
      } catch {
        return `{emoji} {name}`;
      }
    },
    async getTicketData(interaction: Context) {
      const ticketData = await ticketSchema.findOne({
        Guild: interaction.guildId,
      });
      if (!ticketData) return false;

      return ticketData;
    },

    async getChannelTicket(interaction: Context) {
      const ticketChannelData = await ticketChannels.findOne({
        Guild: interaction.guildId,
        channelID: `${interaction.channel?.id}`,
      });
      return ticketChannelData;
    },

    async isTicket(interaction: Context) {
      const ticketChannelData = await ticketChannels.findOne({
        Guild: `${interaction.guild!.id}`,
        channelID: `${interaction.channel!.id}`,
      });

      if (ticketChannelData) {
        return true;
      }
      return false;
    },

    async transcript(client: AeonaBot, channel: Channel) {
      const file = await createTranscript(client, channel);
      //@ts-ignore
      file.blob = await file.blob.text();
      client.helpers.sendMessage(`${channel.id}`, {
        file: file,
      });
    },
    async setXP(userId: bigint, guildId: bigint, xp: number) {
      const user = await levels.findOne({ userID: userId, guildID: guildId });
      if (!user) return false;

      user.xp = xp;
      user.level = Math.floor(0.1 * Math.sqrt(user.xp));
      user.lastUpdated = new Date();

      user.save();

      return user;
    },

    async setLevel(userId: bigint, guildId: bigint, level: number) {
      const user = await levels.findOne({ userID: userId, guildID: guildId });
      if (!user) return false;

      user.level = level;
      user.xp = level * level * 100;
      user.lastUpdated = new Date();

      user.save();

      return user;
    },
    async addXP(userId: bigint, guildId: bigint, xp: number) {
      const user = await levels.findOne({ userID: userId, guildID: guildId });

      if (!user) {
        new levels({
          userID: userId,
          guildID: guildId,
          xp,
          level: Math.floor(0.1 * Math.sqrt(xp)),
        }).save();

        return Math.floor(0.1 * Math.sqrt(xp)) > 0;
      }

      user.xp += xp;
      user.level = Math.floor(0.1 * Math.sqrt(user.xp));
      user.lastUpdated = new Date();

      await user.save();

      return Math.floor(0.1 * Math.sqrt((user.xp -= xp))) < user.level;
    },

    async addLevel(userId: bigint, guildId: bigint, level: string) {
      const user = await levels.findOne({ userID: userId, guildID: guildId });
      if (!user) return false;

      user.level += parseInt(level, 10);
      user.xp = user.level * user.level * 100;
      user.lastUpdated = new Date();

      user.save();

      return user;
    },

    async fetchLevels(userId: bigint, guildId: bigint, fetchPosition = true) {
      const user = await levels.findOne({
        userID: userId,
        guildID: guildId,
      });

      const userReturn = {
        // @ts-ignore
        ...user!._doc,
        position: 0,
        cleanXp: 0,
        cleanNextLevelXp: 0,
      };
      if (!user) return false;

      if (fetchPosition === true) {
        const leaderboard = await levels
          .find({
            guildID: guildId,
          })
          .sort([['xp', -1]])
          .exec();

        userReturn.position = leaderboard.findIndex((i) => i.userID === `${userId}`) + 1;
      }

      userReturn.cleanXp = user.xp - client.extras.xpFor(user.level);
      userReturn.cleanNextLevelXp =
        client.extras.xpFor(user.level + 1) - client.extras.xpFor(user.level);
      return userReturn;
    },

    xpFor(targetLevel: number) {
      return targetLevel * targetLevel * 100;
    },
  };
}
