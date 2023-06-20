import GuildDB from '../database/models/guild.js';
import levels from '../database/models/levels.js';
import Schema from '../database/models/logChannels.js';
import Stats from '../database/models/stats.js';
import ticketChannels from '../database/models/ticketChannels.js';
import ticketSchema from '../database/models/tickets.js';
import embeds from './embed.js';
import { InfluxDB } from '@influxdata/influxdb-client';
import { AeonaBot } from './types.js';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Channel,
  CommandInteraction,
  EmbedBuilder,
  Interaction,
  MessageActionRowComponentBuilder,
  Role,
  TextChannel,
} from 'discord.js';
import { SimpleCommandMessage } from 'discordx';
import { createTranscript } from 'discord-html-transcripts';
import { Pagination, PaginationType } from '@discordx/pagination';

const INFLUX_ORG = process.env.INFLUX_ORG as string;
const INFLUX_BUCKET = process.env.INFLUX_BUCKET as string;
const INFLUX_TOKEN = process.env.INFLUX_TOKEN as string;
const INFLUX_URL = process.env.INFLUX_URL as string;
const influxDB = INFLUX_URL && INFLUX_TOKEN ? new InfluxDB({ url: INFLUX_URL, token: INFLUX_TOKEN }) : undefined;

export function additionalProps(client: AeonaBot) {
  return {
    version: 'v0.2.0',
    ...embeds(client),
    influxQuery: influxDB?.getQueryApi(INFLUX_ORG),
    influx: influxDB?.getWriteApi(INFLUX_ORG, INFLUX_BUCKET),
    startTime: new Date().getTime(),
    messageCount: 0,
    capitalizeFirstLetter: (string: string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    buttonReactions(id: any, reactions: any[]) {
      const labels: ButtonBuilder[] = [];
      let comp: ActionRowBuilder<MessageActionRowComponentBuilder>[] = [];

      reactions.map((emoji) => {
        const btn = new ButtonBuilder()
          .setStyle(ButtonStyle.Secondary)
          .setEmoji(`${emoji}`)
          .setCustomId(`reaction_button-${emoji}`);
        return labels.push(btn);
      });

      if (labels.length < 5 || labels.length == 5) {
        const row = new ActionRowBuilder<MessageActionRowComponentBuilder>();

        row.addComponents(labels.slice(0, 5));

        comp = [row];
      }

      if ((labels.length < 10 && labels.length > 5) || labels.length == 10) {
        const row = new ActionRowBuilder<MessageActionRowComponentBuilder>();
        const row2 = new ActionRowBuilder<MessageActionRowComponentBuilder>();

        row.addComponents(labels.slice(0, 5));
        row2.addComponents(labels.slice(5, 10));

        comp = [row, row2];
      }

      if ((labels.length < 15 && labels.length > 10) || labels.length == 15) {
        const row = new ActionRowBuilder<MessageActionRowComponentBuilder>();
        const row2 = new ActionRowBuilder<MessageActionRowComponentBuilder>();
        const row3 = new ActionRowBuilder<MessageActionRowComponentBuilder>();

        row.addComponents(labels.slice(0, 5));
        row2.addComponents(labels.slice(5, 10));
        row3.addComponents(labels.slice(10, 15));

        comp = [row, row2, row3];
      }

      if ((labels.length < 20 && labels.length > 15) || labels.length == 20) {
        const row = new ActionRowBuilder<MessageActionRowComponentBuilder>();
        const row2 = new ActionRowBuilder<MessageActionRowComponentBuilder>();
        const row3 = new ActionRowBuilder<MessageActionRowComponentBuilder>();
        const row4 = new ActionRowBuilder<MessageActionRowComponentBuilder>();

        row.addComponents(labels.slice(0, 5));
        row2.addComponents(labels.slice(5, 10));
        row3.addComponents(labels.slice(10, 15));
        row4.addComponents(labels.slice(15, 20));

        comp = [row, row2, row3, row4];
      }

      if ((labels.length < 25 && labels.length > 20) || labels.length == 25) {
        const row = new ActionRowBuilder<MessageActionRowComponentBuilder>();
        const row2 = new ActionRowBuilder<MessageActionRowComponentBuilder>();
        const row3 = new ActionRowBuilder<MessageActionRowComponentBuilder>();
        const row4 = new ActionRowBuilder<MessageActionRowComponentBuilder>();
        const row5 = new ActionRowBuilder<MessageActionRowComponentBuilder>();

        row.addComponents(labels.slice(0, 5));
        row2.addComponents(labels.slice(5, 10));
        row3.addComponents(labels.slice(10, 15));
        row4.addComponents(labels.slice(15, 20));
        row5.addComponents(labels.slice(20, 25));

        comp = [row, row2, row3, row4, row5];
      }

      return comp;
    },
    async getLogs(guildId: any) {
      const data = await Schema.findOne({ Guild: guildId });
      if (data && data.Channel) {
        const channel = await client.channels.cache.get(data.Channel);
        return channel;
      }
      return false;
    },
    async isPremium(guildId: string) {
      let guildDB = await GuildDB.findOne({ Guild: `${guildId}` });
      if (!guildDB)
        guildDB = new GuildDB({
          Guild: `${guildId}`,
        });
      return guildDB.isPremium === 'true';
    },
    async createChannelSetup(Schema: any, channel: Channel, interaction: CommandInteraction | SimpleCommandMessage) {
      Schema.findOne(
        {
          Guild: interaction instanceof CommandInteraction ? interaction.guildId : interaction.message.guildId,
        },
        async (err: any, data: { Channel: string; save: () => void }) => {
          if (data) {
            data.Channel = channel.id;
            data.save();
          } else {
            new Schema({
              Guild: interaction instanceof CommandInteraction ? interaction.guildId : interaction.message.guildId,
              Channel: `${channel.id}`,
            }).save();
          }
        },
      );

      client.extras.embed(
        {
          title: 'Successful!',
          desc: `Channel has been set up successfully! \n **[To learn how to use me read my documentation](https://docs.aeona.xyz/)**`,
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
    async createRoleSetup(Schema: any, role: Role, interaction: CommandInteraction | SimpleCommandMessage) {
      Schema.findOne(
        {
          Guild: interaction instanceof CommandInteraction ? interaction.guildId : interaction.message.guildId,
        },
        async (err: any, data: { Role: string; save: () => void }) => {
          if (data) {
            data.Role = role.id;
            data.save();
          } else {
            new Schema({
              Guild: interaction instanceof CommandInteraction ? interaction.guildId : interaction.message.guildId,
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
    async generateEmbed(start: any, lb: any[], title: any) {
      const current = lb.slice(start, start + 10);
      const result = current.join('\n');

      const embed = client.extras.templateEmbed().setTitle(`${title}`).setDescription(`${result.toString()}`);

      return embed;
    },

    async createLeaderboard(title: any, lb: any[], interaction: SimpleCommandMessage | CommandInteraction) {
      const embeds: EmbedBuilder[] = [];

      for (let i = 0; i < lb.length; i += 10) {
        embeds.push(await this.generateEmbed(i, lb, title));
      }

      const pagination = new Pagination(
        interaction instanceof CommandInteraction ? interaction : interaction.message,
        embeds.map((e) => {
          return { embeds: [e] };
        }),
        {
          type: PaginationType.SelectMenu,
          showStartEnd: false,
          idle: 1000 * 60 * 20,
          pageText: embeds.map((e, index) => `${index * 10 + 1} - ${index * 10 + 10}`),
        },
      );
    },
    getTemplate: async (guild: string) => {
      try {
        const data = await Stats.findOne({ Guild: `${guild}` });

        if (data && data.ChannelTemplate) {
          return data.ChannelTemplate;
        }
        return `{emoji} {name}`;
      } catch {
        return `{emoji} {name}`;
      }
    },
    async getTicketData(interaction: CommandInteraction | SimpleCommandMessage) {
      const ticketData = await ticketSchema.findOne({
        Guild: interaction instanceof CommandInteraction ? interaction.guildId : interaction.message.guildId,
      });
      if (!ticketData) return false;

      return ticketData;
    },

    async getChannelTicket(interaction: CommandInteraction | SimpleCommandMessage) {
      const ticketChannelData = await ticketChannels.findOne({
        Guild: interaction instanceof CommandInteraction ? interaction.guildId : interaction.message.guildId,
        channelID: `${
          interaction instanceof CommandInteraction ? interaction.channelId : interaction.message.channelId
        }`,
      });
      return ticketChannelData;
    },

    async isTicket(interaction: CommandInteraction | SimpleCommandMessage) {
      const ticketChannelData = await ticketChannels.findOne({
        Guild: interaction instanceof CommandInteraction ? interaction.guildId : interaction.message.guildId,
        channelID: `${
          interaction instanceof CommandInteraction ? interaction.channelId : interaction.message.channelId
        }`,
      });

      if (ticketChannelData) {
        return true;
      }
      return false;
    },

    async transcript(client: AeonaBot, channel: TextChannel) {
      const file = await createTranscript(channel, {
        footerText: 'Transcript by Aeona',
        poweredBy: false,
      });

      channel.send({
        files: [file],
      });
    },
    async setXP(userId: string, guildId: string, xp: number) {
      const user = await levels.findOne({ userID: userId, guildID: guildId });
      if (!user) return false;

      user.xp = xp;
      user.level = Math.floor(0.1 * Math.sqrt(user.xp));
      user.lastUpdated = new Date();

      user.save();

      return user;
    },

    async setLevel(userId: string, guildId: string, level: number) {
      const user = await levels.findOne({ userID: userId, guildID: guildId });
      if (!user) return false;

      user.level = level;
      user.xp = level * level * 100;
      user.lastUpdated = new Date();

      user.save();

      return user;
    },
    async addXP(userId: string, guildId: string, xp: number) {
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

    async addLevel(userId: string, guildId: string, level: string) {
      const user = await levels.findOne({ userID: userId, guildID: guildId });
      if (!user) return false;

      user.level += parseInt(level, 10);
      user.xp = user.level * user.level * 100;
      user.lastUpdated = new Date();

      user.save();

      return user;
    },

    async fetchLevels(userId: string, guildId: string, fetchPosition = true) {
      const user = await levels.findOne({
        userID: userId,
        guildID: guildId,
      });

      if (!user) return false;
      const userReturn = {
        // @ts-ignore
        ...user!._doc,
        position: 0,
        cleanXp: 0,
        cleanNextLevelXp: 0,
      };
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
      userReturn.cleanNextLevelXp = client.extras.xpFor(user.level + 1) - client.extras.xpFor(user.level);
      return userReturn;
    },

    xpFor(targetLevel: number) {
      return targetLevel * targetLevel * 100;
    },
  };
}
