import GuildDB from '../database/models/guild.js';
import levels from '../database/models/levels.js';
import Schema from '../database/models/logChannels.js';
import Stats from '../database/models/stats.js';
import ticketChannels from '../database/models/ticketChannels.js';
import ticketSchema from '../database/models/tickets.js';
import embeds from './embed.js';
import { InfluxDB } from '@influxdata/influxdb-client';
import { AeonaBot } from './types.js';
import dotenv from 'dotenv';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Channel,
  CommandInteraction,
  EmbedBuilder,
  Message,
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
dotenv.config();

import { Leaderboard } from '@gamestdio/leaderboard';
import { Model } from 'mongoose';
import mongoose from 'mongoose';

export function additionalProps(client: AeonaBot) {
  const db = mongoose.connection.getClient().db('Leaderboard');
  return {
    version: 'v0.2.0',
    ...embeds(client),
    influxQuery: influxDB?.getQueryApi(INFLUX_ORG),
    //@ts-ignore
    leaderboard: new Leaderboard(db),
    ordinalSuffix: (i: number) => {
      const j = i % 10,
        k = i % 100;
      if (j == 1 && k != 11) {
        return i + 'st';
      }
      if (j == 2 && k != 12) {
        return i + 'nd';
      }
      if (j == 3 && k != 13) {
        return i + 'rd';
      }
      return i + 'th';
    },
    influx: influxDB?.getWriteApi(INFLUX_ORG, INFLUX_BUCKET),
    startTime: new Date().getTime(),
    messageCount: 0,
    replaceMentions: (message: Message) => {
      message.mentions.users.forEach((user) => {
        message.content = message.content
          .replaceAll(`<@!${user.id}>`, `<@${user.id}>`)
          .replaceAll(`<@${user.id}>`, `@${user.username}`);
      });
      message.mentions.channels.forEach((channel: any) => {
        message.content = message.content.replaceAll(`<#${channel.id}>`, `@${channel.name}`);
      });
      message.mentions.roles.forEach((role: any) => {
        message.content = message.content.replaceAll(`<@&${role.id}>`, `@${role.name}`);
      });

      return message;
    },
    capitalizeFirstLetter: (string: string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    getChannel: async <
      T = {
        Guild: string;
        Channel: string;
      },
    >(
      schema: Model<T>,
      guildId: string,
      channelId: string,
    ): Promise<(mongoose.Document<any, {}, T> & T) | undefined> => {
      if (!channelId) return;
      const channels = await schema.find({ Guild: guildId });
      const isPremium = await client.extras.isPremium(guildId);
      if (channels.length == 0) return undefined;

      if (isPremium) return channels.find((channel: any) => channel.Channel?.trim() == channelId.trim());
      //@ts-ignore
      else if (channels[0].Channel.trim() == channelId.trim()) return channels[0];

      return undefined;
    },
    buttonReactions(reactions: string[], ids: string[]) {
      const labels: ButtonBuilder[] = [];
      let comp: ActionRowBuilder<MessageActionRowComponentBuilder>[] = [];

      reactions.map((emoji: string, i) => {
        const btn = new ButtonBuilder()
          .setStyle(ButtonStyle.Secondary)
          .setEmoji(`${emoji}`)
          .setCustomId(`reaction_button-${ids[i]}`);
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
          desc: `Channel has been set up successfully! \n **[To learn how to use me read my documentation](https://docs.aeonabot.xyz/)**`,
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

      pagination.send();
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
      let user = await levels.findOne({ User: userId, Guild: guildId });
      if (!user) {
        user = new levels({
          User: userId,
          Guild: guildId,
          level: 0,
          xp: 0,
        });
      }

      user.xp = xp;
      user.level = Math.floor(0.1 * Math.sqrt(user.xp));
      user.lastUpdated = new Date();

      user.save();

      return user;
    },

    async setLevel(userId: string, guildId: string, level: number) {
      let user = await levels.findOne({ User: userId, Guild: guildId });
      if (!user) {
        user = new levels({
          User: userId,
          Guild: guildId,
          level: 0,
          xp: 0,
        });
      }

      user.level = level;
      user.xp = level * level * 100;
      user.lastUpdated = new Date();

      user.save();

      return user;
    },
    async addXP(userId: string, guildId: string, xp: number) {
      const user = await levels.findOne({ User: userId, Guild: guildId });

      if (!user) {
        const u = new levels({
          User: userId,
          Guild: guildId,
          xp,
          level: Math.floor(0.1 * Math.sqrt(xp)),
        });

        u.save();
        return { ...u, leveledUp: false };
      }

      user.xp += xp;
      user.level = Math.floor(0.1 * Math.sqrt(user.xp));
      user.lastUpdated = new Date();

      await user.save();

      return { ...user, leveledUp: Math.floor(0.1 * Math.sqrt((user.xp -= xp))) < user.level };
    },

    async addLevel(userId: string, guildId: string, level: string) {
      let user = await levels.findOne({ User: userId, Guild: guildId });
      if (!user) {
        user = new levels({
          User: userId,
          Guild: guildId,
          level: 0,
          xp: 0,
        });
      }

      user.level += parseInt(level, 10);
      user.xp = user.level * user.level * 100;
      user.lastUpdated = new Date();

      user.save();

      return user;
    },

    async fetchLevels(userId: string, guildId: string, fetchPosition = true) {
      let user = await levels.findOne({
        User: userId,
        Guild: guildId,
      });

      if (!user) {
        user = new levels({
          User: userId,
          Guild: guildId,
          level: 0,
          xp: 0,
        });
      }
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
            Guild: guildId,
          })
          .sort([['xp', -1]])
          .exec();

        userReturn.position = leaderboard.findIndex((i) => i.User === `${userId}`) + 1;
      }

      userReturn.cleanXp = user.xp - client.extras.xpFor(user.level);
      userReturn.cleanNextLevelXp = client.extras.xpFor(user.level + 1) - client.extras.xpFor(user.level);
      return userReturn;
    },

    xpFor(targetLevel: number) {
      return targetLevel * targetLevel * 100;
    },

    wordlist:
      `about, above, abuse, accept, accident, accuse, across, activist, actor, administration, admit, adult, advertise, advise, affect, afraid, after, again, against, agency, aggression, agree, agriculture, force, airplane, airport, album, alcohol, alive, almost, alone, along, already, although, always, ambassador, amend, ammunition, among, amount, anarchy, ancestor, ancient, anger, animal, anniversary, announce, another, answer, apologize, appeal, appear, appoint, approve, archeology, argue, around, arrest, arrive, artillery, assist, astronaut, astronomy, asylum, atmosphere, attach, attack, attempt, attend, attention, automobile, autumn, available, average, avoid, awake, award, balance, balloon, ballot, barrier, battle, beauty, because, become, before, begin, behavior, behind, believe, belong, below, betray, better, between, biology, black, blame, bleed, blind, block, blood, border, borrow, bottle, bottom, boycott, brain, brave, bread, break, breathe, bridge, brief, bright, bring, broadcast, brother, brown, budget, build, building, bullet, burst, business, cabinet, camera, campaign, cancel, cancer, candidate, capital, capture, career, careful, carry, catch, cause, ceasefire, celebrate, center, century, ceremony, chairman, champion, chance, change, charge, chase, cheat, cheer, chemicals, chemistry, chief, child, children, choose, circle, citizen, civilian, civil, rights, claim, clash, class, clean, clear, clergy, climate, climb, clock, close, cloth, clothes, cloud, coalition, coast, coffee, collapse, collect, college, colony, color, combine, command, comment, committee, common, communicate, community, company, compare, compete, complete, complex, compromise, computer, concern, condemn, condition, conference, confirm, conflict, congratulate, Congress, connect, conservative, consider, constitution, contact, contain, container, continent, continue, control, convention, cooperate, correct, corruption, cotton, count, country, court, cover, crash, create, creature, credit, crime, criminal, crisis, criticize, crops, cross, crowd, crush, culture, curfew, current, custom, customs, damage, dance, danger, daughter, debate, decide, declare, decrease, defeat, defend, deficit, define, degree, delay, delegate, demand, democracy, demonstrate, denounce, depend, deplore, deploy, depression, describe, desert, design, desire, destroy, detail, detain, develop, device, dictator, different, difficult, dinner, diplomat, direct, direction, disappear, disarm, disaster, discover, discrimination, discuss, disease, dismiss, dispute, dissident, distance, divide, doctor, document, dollar, donate, double, dream, drink, drive, drown, during, early, earth, earthquake, ecology, economy, education, effect, effort, either, elect, electricity, embassy, embryo, emergency, emotion, employ, empty, enemy, energy, enforce, engine, engineer, enjoy, enough, enter, environment, equal, equipment, escape, especially, establish, estimate, ethnic, evaporate, event, every, evidence, exact, examine, example, excellent, except, exchange, excuse, execute, exercise, exile, exist, expand, expect, expel, experience, experiment, expert, explain, explode, explore, export, express, extend, extra, extraordinary, extreme, extremist, factory, false, family, famous, father, favorite, federal, female, fence, fertile, field, fierce, fight, final, financial, finish, fireworks, first, float, flood, floor, flower, fluid, follow, force, foreign, forest, forget, forgive, former, forward, freedom, freeze, fresh, friend, frighten, front, fruit, funeral, future, gather, general, generation, genocide, gentle, glass, goods, govern, government, grain, grass, great, green, grind, ground, group, guarantee, guard, guerrilla, guide, guilty, happen, happy, harvest, headquarters, health, heavy, helicopter, hijack, history, holiday, honest, honor, horrible, horse, hospital, hostage, hostile, hotel, house, however, human, humor, hunger, hurry, husband, identify, ignore, illegal, imagine, immediate, immigrant, import, important, improve, incident, incite, include, increase, independent, individual, industry, infect, inflation, influence, inform, information, inject, injure, innocent, insane, insect, inspect, instead, instrument, insult, intelligence, intelligent, intense, interest, interfere, international, Internet, intervene, invade, invent, invest, investigate, invite, involve, island, issue, jewel, joint, judge, justice, kidnap, knife, knowledge, labor, laboratory, language, large, laugh, launch, learn, leave, legal, legislature, letter, level, liberal, light, lightning, limit, liquid, listen, literature, little, local, lonely, loyal, machine, magazine, major, majority, manufacture, march, market, marry, material, mathematics, matter, mayor, measure, media, medicine, member, memorial, memory, mental, message, metal, method, microscope, middle, militant, military, militia, mineral, minister, minor, minority, minute, missile, missing, mistake, model, moderate, modern, money, month, moral, morning, mother, motion, mountain, mourn, movement, movie, murder, music, mystery, narrow, nation, native, natural, nature, necessary, negotiate, neighbor, neither, neutral, never, night, noise, nominate, normal, north, nothing, nowhere, nuclear, number, object, observe, occupy, ocean, offensive, offer, office, officer, official, often, operate, opinion, oppose, opposite, oppress, orbit, order, organize, other, overthrow, paint, paper, parachute, parade, pardon, parent, parliament, partner, party, passenger, passport, patient, peace, people, percent, perfect, perform, period, permanent, permit, person, persuade, physical, physics, picture, piece, pilot, place, planet, plant, plastic, please, plenty, point, poison, police, policy, politics, pollute, popular, population, position, possess, possible, postpone, poverty, power, praise, predict, pregnant, present, president, press, pressure, prevent, price, prison, private, prize, probably, problem, process, produce, profession, professor, profit, program, progress, project, promise, propaganda, property, propose, protect, protest, prove, provide, public, publication, publish, punish, purchase, purpose, quality, question, quick, quiet, radar, radiation, radio, railroad, raise, reach, react, ready, realistic, reason, reasonable, rebel, receive, recent, recession, recognize, record, recover, reduce, reform, refugee, refuse, register, regret, reject, relations, release, religion, remain, remains, remember, remove, repair, repeat, report, represent, repress, request, require, rescue, research, resign, resist, resolution, resource, respect, responsible, restaurant, restrain, restrict, result, retire, return, revolt, right, river, rocket, rough, round, rubber, rural, sabotage, sacrifice, sailor, satellite, satisfy, school, science, search, season, second, secret, security, seeking, seize, Senate, sense, sentence, separate, series, serious, serve, service, settle, several, severe, shake, shape, share, sharp, sheep, shell, shelter, shine, shock, shoot, short, should, shout, shrink, sickness, signal, silence, silver, similar, simple, since, single, sister, situation, skeleton, skill, slave, sleep, slide, small, smash, smell, smoke, smooth, social, soldier, solid, solve, sound, south, space, speak, special, speech, speed, spend, spill, spirit, split, sport, spread, spring, square, stand, start, starve, state, station, statue, steal, steam, steel, stick, still, stone, store, storm, story, stove, straight, strange, street, stretch, strike, strong, structure, struggle, study, stupid, subject, submarine, substance, substitute, subversion, succeed, sudden, suffer, sugar, suggest, suicide, summer, supervise, supply, support, suppose, suppress, surface, surplus, surprise, surrender, surround, survive, suspect, suspend, swallow, swear, sweet, sympathy, system, target, taste, teach, technical, technology, telephone, telescope, television, temperature, temporary, tense, terrible, territory, terror, terrorist, thank, theater, theory, there, these, thick, thing, think, third, threaten, through, throw, tired, today, together, tomorrow, tonight, torture, total, touch, toward, trade, tradition, traffic, tragic, train, transport, transportation, travel, treason, treasure, treat, treatment, treaty, trial, tribe, trick, troops, trouble, truce, truck, trust, under, understand, unite, universe, university, unless, until, urgent, usual, vacation, vaccine, valley, value, vegetable, vehicle, version, victim, victory, video, village, violate, violence, visit, voice, volcano, volunteer, wages, waste, watch, water, wealth, weapon, weather, weigh, welcome, wheat, wheel, where, whether, which, while, white, whole, willing, window, winter, withdraw, without, witness, woman, wonder, wonderful, world, worry, worse, worth, wound, wreck, wreckage, write, wrong, yellow, yesterday, young`.split(
        ', ',
      ),
  };
}
