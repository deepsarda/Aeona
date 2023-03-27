import { Point } from '@influxdata/influxdb-client';
import { getBotIdFromToken } from 'discordeno';
import { User } from 'discordeno/transformers';
import { ActivityTypes, DiscordReady } from 'discordeno/types';
import fs from 'fs';
import { cpus } from 'os';

import bumpreminder from '../../database/models/bumpreminder.js';
import functions from '../../database/models/guild.js';
import premium from '../../database/models/premium.js';
import { AeonaBot } from '../../extras/index.js';
import { bootstrap } from '../../website/src/index.js';

export default async (
  client: AeonaBot,
  _payload: {
    shardId: number;
    v: number;
    user: User;
    guilds: bigint[];
    sessionId: string;
    shard?: number[] | undefined;
    applicationId: bigint;
  },
  _rawPayload: DiscordReady,
) => {
  if (!client.extras.ready) {
    client.extras.ready = true;

    if (client.extras.botConfig.website.enabled) bootstrap(client);

    client.amethystUtils.updateSlashCommands();
    client.user = await client.helpers.getUser(getBotIdFromToken(client.extras.botConfig.TOKEN));

    client.extras.messageCount = 0;
    try {
      const point = new Point('per_core_cpu_load').tag('action', 'sync');

      let index = 0;
      for (const { times } of cpus())
        point.floatField(`cpu_${index++}`, (times.user + times.nice + times.sys + times.irq) / times.idle);

      client.extras.influx.writePoint(point);

      const usage = process.memoryUsage();
      client.extras.influx.writePoint(
        new Point('memory') //
          .tag('action', 'sync')
          .floatField('total', usage.heapTotal)
          .floatField('used', usage.heapUsed),
      );

      const value = client.extras.messageCount;
      client.extras.messageCount = 0;

      client.extras.influx.writePoint(
        new Point('message_count') //
          .tag('action', 'sync')
          .intField('value', value),
      );

      const formatter = Intl.NumberFormat('en', {
        notation: 'compact',
      });
      await client.helpers.editBotStatus({
        activities: [
          {
            type: ActivityTypes.Game,
            name: `${client.extras.botConfig.PREFIX}help on ${formatter.format(client.extras.guildcount)} servers.`,

            createdAt: new Date().getTime(),
          },
        ],
        status: 'idle',
      });
    } catch (e) {
      console.error(JSON.stringify(e));
    }
    setInterval(async () => {
      try {
        const formatter = Intl.NumberFormat('en', {
          notation: 'compact',
        });
        client.helpers.editBotStatus({
          activities: [
            {
              type: ActivityTypes.Game,
              name: `${client.extras.botConfig.PREFIX}help on ${formatter.format(client.extras.guildcount)} servers.`,

              createdAt: new Date().getTime(),
            },
          ],
          status: 'idle',
        });

        const point = new Point('per_core_cpu_load').tag('action', 'sync');

        let index = 0;
        for (const { times } of cpus()) {
          point.floatField(`cpu_${index++}`, (times.user + times.nice + times.sys + times.irq) / times.idle);
        }

        client.extras.influx.writePoint(point);

        const usage = process.memoryUsage();
        client.extras.influx.writePoint(
          new Point('memory') //
            .tag('action', 'sync')
            .floatField('total', usage.heapTotal)
            .floatField('used', usage.heapUsed),
        );

        client.extras.influx.writePoint(
          new Point('cache') //
            .tag('type', 'guilds')
            .intField('total', client.extras.guildcount),
        );

        client.extras.influx.writePoint(
          new Point('cache') //
            .tag('type', 'channels')
            .intField('total', client.cache.channels.memory.size),
        );

        client.extras.influx.writePoint(
          new Point('cache') //
            .tag('type', 'users')
            .intField('total', client.cache.users.memory.size),
        );

        client.extras.influx.writePoint(
          new Point('cache') //
            .tag('type', 'members')
            .intField('total', client.cache.members.memory.size),
        );

        client.extras.influx.writePoint(
          new Point('cache') //
            .tag('type', 'messages')
            .intField('total', client.cache.messages.memory.size),
        );

        client.extras.influx.writePoint(
          new Point('cache') //
            .tag('type', 'roles')
            .intField('total', client.cache.roles.memory.size),
        );

        client.extras.influx.writePoint(
          new Point('guilds').tag('action', 'sync').intField('value', client.extras.guildcount),
        );
      } catch (e) {
        console.error(JSON.stringify(e));
      }
    }, 10000);
    setInterval(async () => {
      try {
        const value = client.extras.messageCount;
        client.extras.messageCount = 0;

        client.extras.influx.writePoint(
          new Point('message_count') //
            .tag('action', 'sync')
            .intField('value', value),
        );
      } catch (e) {
        console.error(JSON.stringify(e));
      }
    }, 60000);

    setInterval(() => {
      if (client.cache.users.memory.size > 500) {
        for (const [_userId, user] of client.cache.users.memory) {
          if (user.id != client.user.id) client.cache.users.delete(user.id);
        }
      }

      if (client.cache.messages.memory.size > 500) {
        for (const [messageId, _message] of client.cache.messages.memory) {
          client.cache.messages.delete(messageId);
        }
      }
      if (client.cache.channels.memory.size > 50000) {
        for (const [channelId, _channe] of client.cache.channels.memory) {
          client.cache.channels.delete(channelId);
        }
      }
      for (const [messageId, message] of client.cache.messages.memory) {
        if (!message.timestamp) client.cache.messages.delete(messageId);
        if (Date.now() - message.timestamp > 1000 * 60 * 2) client.cache.messages.delete(messageId);
      }
    }, 1000 * 10);

    client.emit('updateClock', client);

    setInterval(async () => {
      const reminders = await bumpreminder.find();
      for (const reminder of reminders) {
        try {
          if (!reminder.LastBump || !reminder.Channel) return;
          if (Date.now() > reminder.LastBump + 7200000) {
            reminder.LastBump = Date.now();
            reminder.save();

            const channel = await client.cache.channels.get(BigInt(reminder.Channel!));
            if (channel)
              await client.extras.embed(
                {
                  content: `<@&${reminder.Role}>`,
                  title: `Time to bump!`,
                  desc: reminder.Message ?? `Use /bump to bump this server!`,
                  type: 'reply',
                },
                channel,
              );
          }
        } catch (err) {
          //
        }
      }
    }, 1000 * 60);

    setInterval(async () => {
      await premium.deleteMany({
        Code: null,
      });
      const conditional = {
        isPremium: 'true',
      };
      const results = await functions.find(conditional);

      if (results && results.length) {
        for (const result of results) {
          if (Date.now() >= Number(result.Premium!.ExpiresAt)) {
            const guildPremium = await client.cache.guilds.get(BigInt(result.Guild!));
            if (guildPremium) {
              const user = await client.cache.users.get(BigInt(result.Premium!.RedeemedBy!.id));

              if (user) {
                const channel = await client.helpers.getDmChannel(user.id);
                client.extras.errNormal(
                  {
                    error: `Hey ${user.username}, Premium in ${guildPremium.name} has Just expired. \n\nThank you for purchasing premium previously! We hope you enjoyed what you purchased. \n\n If your still a premium member you can request a renewal in my server.`,
                  },
                  channel,
                );
              }

              result.isPremium = 'false';
              //@ts-ignore
              result.Premium!.RedeemedBy.id = null;
              //@ts-ignore
              result.Premium!.RedeemedBy.tag = null;
              //@ts-ignore
              result.Premium!.RedeemedAt = null;
              //@ts-ignore
              result.Premium!.ExpiresAt = null;
              //@ts-ignore
              result.Premium!.Plan = null;

              await result.save();
            }
          }
        }
      }
    }, 500000);

    const categories: { name: string }[] = [];
    const commands: {
      name: string;
      description: string;
      usage: string;
      category: string;
    }[] = [];
    client.category.forEach((c) => {
      categories.push({
        name: c.name,
      });
      c.commands.forEach((command) => {
        commands.push({
          usage: `+${c.uniqueCommands ? command.name : `${c.name} ${command.name}`} ${command.args
            .map((arg) => {
              if (arg.required) return `${arg.name}`;
              else return `${arg.name}(Optional)`;
            })
            .join(' ')}`,
          name: command.name,
          description: command.description,
          category: command.category,
        });
      });
    });

    //Write to json file.
    fs.writeFileSync('./categories.json', JSON.stringify(categories));
    fs.writeFileSync('./commands.json', JSON.stringify(commands));

    setInterval(async () => {
      if (client.extras.requestMembersGuilds.length > 0) {
        client.gateway.manager.shards.get(0).send({
          op: 8,
          d: {
            guild_id: client.extras.requestMembersGuilds[0] + '',
          },
        });

        client.extras.requestMembersGuilds.shift();
      }
    }, 100);
  }
};
