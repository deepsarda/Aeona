import {
  ButtonInteraction,
  CacheType,
  ChannelSelectMenuInteraction,
  ChannelType,
  CommandInteraction,
  Interaction,
  MappedInteractionTypes,
  MentionableSelectMenuInteraction,
  RoleSelectMenuInteraction,
  StringSelectMenuInteraction,
  TextChannel,
  UserSelectMenuInteraction,
} from 'discord.js';
import { SimpleCommandMessage } from 'discordx';
import { Model } from 'mongoose';
import { Components } from './components.js';
import { bot } from '../bot.js';

export async function createSetupWizard(
  command: CommandInteraction | SimpleCommandMessage,
  name: string,
  setupConfig: SetupWizardConfig,
  schema: Model<any>,
) {
  const user = command instanceof CommandInteraction ? command.user : command.message.author;
  const guild = command instanceof CommandInteraction ? command.guild! : command.message.guild!;
  let data = await schema.find({ Guild: `${guild.id}` });

  async function sendMessage() {
    data = await schema.find({ Guild: `${guild.id}` });
    const comp = new Components();
    comp.addButton('Auto Create', 'Primary', 'autocreate');
    comp.addButton('Create', 'Success', 'createconfig');

    if (data.length > 0) {
      comp.addSelectComponent(
        'Edit/Delete a system.',
        'editoptions',
        data.map((c, i) => {
          return {
            label: `System ${i}`,
            value: `${i}`,
            description: `Edit/Delete the settings for System ${i}`,
          };
        }),
        'Edit/Delete the settings for your Level Systems',
      );
    } else {
      comp.addSelectComponent(
        'Edit/Delete a system.',
        'editoptions',
        [
          {
            label: 'No Systems',
            value: '-1',
          },
        ],
        'There are no systems to edit.',
        1,
        1,
        true,
      );
    }

    const message = await bot.extras.embed(
      {
        content: '',
        title: `Setup Wizard For ${name}`,
        desc: `Choose a to edit/delete/create a system for down below. \n You currently have \`${data.length} systems\` setup. `,
        components: comp,
        type: 'editreply',
      },
      command,
    );

    message
      .awaitMessageComponent({
        filter: (i) => i.user.id == user.id,
      })
      .then(handleInteraction)
      .catch((e) => {
        console.log(e);
        message.edit({
          content: 'This command has expired.',
          components: [],
        });
      });
  }

  async function handleInteraction(
    interaction:
      | ButtonInteraction
      | StringSelectMenuInteraction
      | UserSelectMenuInteraction
      | RoleSelectMenuInteraction
      | MentionableSelectMenuInteraction
      | ChannelSelectMenuInteraction,
  ) {
    if (interaction.customId == 'autocreate' || interaction.customId == 'createconfig') {
      const premium = await bot.extras.isPremium(guild.id);

      if (!premium && data.length > 0) {
        interaction.reply({
          content: `Good day there, \nThis server appears to be non-premium, thus you can only have one system. \n\n  You can get premium for just **$2.99** at https://patreon.com/aeonicdiscord \n **or** \n *boost our support server*. \n Use \`+perks\` to see all the perks of premium. `,
          ephemeral: true,
        });
        return sendMessage();
      } else if (premium && data.length > 8) {
        interaction.reply({
          content: `Hello, despite the fact that this server is premium, you can only have a maximum of 8 systems owing to Discord ratelimits. Please accept my apologies for the inconvenience.`,
          ephemeral: true,
        });
        return sendMessage();
      }
    }
    if (interaction.customId == 'autocreate') {
      const channel = await guild.channels.create({
        name: name,
        type: ChannelType.GuildText,
      });

      await new schema({
        Guild: `${guild.id}`,
        Channel: `${channel.id}`,
      }).save();

      interaction.reply({
        content: `I have successfully setup <#${channel.id}> as a channel for ${name}.`,
        ephemeral: true,
      });
      setupConfig.createCallback(channel);
      return sendMessage();
    } else if (interaction.customId == 'createconfig') {
      await createConfig(interaction);
    } else if (interaction.customId == 'editoptions') {
      await editConfig(interaction);
    }
  }

  async function createConfig(
    interaction:
      | ButtonInteraction
      | StringSelectMenuInteraction
      | UserSelectMenuInteraction
      | RoleSelectMenuInteraction
      | MentionableSelectMenuInteraction
      | ChannelSelectMenuInteraction,
  ) {
    let success = false;
    let invalidResponse = false;

    while (!success) {
      if (!invalidResponse) {
        interaction.reply({
          content: `Please mention the channel or send cancel to cancel the setup.`,
          ephemeral: true,
        });
      } else {
        interaction.editReply({
          content: `You did not mention a channel. Please mention the channel or send cancel to cancel the setup.`,
        });
      }

      const message = (
        await interaction.channel?.awaitMessages({
          filter: (m) => m.author.id == user.id,
          max: 1,
          time: 30000,
        })
      )?.at(0);

      if (!message) return;

      if (message.content.toLowerCase() == 'cancel') {
        interaction.reply({
          content: `Setup cancelled.`,
          ephemeral: true,
        });

        return;
      }

      if (message.mentions.channels.size > 0) {
        success = true;

        message.delete();

        await new schema({
          Guild: `${guild.id}`,
          Channel: `${message.mentions.channels.first()!.id}`,
        }).save();

        await interaction.followUp({
          content: `I have successfully setup <#${message.mentions.channels.first()!.id}> as a level log channel.`,
          flags: 1 << 6,
        });
        setupConfig.createCallback(message.mentions.channels.first() as unknown as TextChannel);
      } else {
        invalidResponse = true;
      }
    }

    return sendMessage();
  }

  async function editConfig(
    interaction:
      | ButtonInteraction
      | StringSelectMenuInteraction
      | UserSelectMenuInteraction
      | RoleSelectMenuInteraction
      | MentionableSelectMenuInteraction
      | ChannelSelectMenuInteraction,
  ) {
    let int = interaction as unknown as StringSelectMenuInteraction<CacheType>;
    const schema = data[Number(int.values![0])];

    const components = new Components();

    components.addButton('Set Channel', 'Primary', 'setchannel');
    for (const i of setupConfig.options) {
      components.addButton('Set ' + i.name.charAt(0).toUpperCase() + i.name.slice(1) + '', 'Primary', i.id);
    }
    components.addButton('Set Message', 'Primary', 'setmessage');
    components.addButton('Delete this Setting', 'Danger', 'deleteconfig');
    const mes = await bot.extras.embed(
      {
        title: `System ${int.values![0]}`,
        desc: `
        <:F_Settings:1049292164103938128> **Settings**
        <:channel:1049292166343688192> Channel: <#${schema.Channel}>
        `,
        components: components,
        type: 'editreply',
      },
      command,
    );

    const config = await bot.extras.getEmbedConfig({
      guild: guild,
      user: user,
    });

    for (const i of setupConfig.options) {
      let m = {
        content: i.default,
      };

      if (schema[i.schemaParam]) {
        try {
          m = JSON.parse(schema[i.schemaParam]);
        } catch (e) {
          //
        }
      }

      m.content = `**<:chatbot:1049292165282541638> ${name} ${i.name} :small_red_triangle_down:** \n ${m.content}`;

      if (command instanceof CommandInteraction) command.channel?.send(bot.extras.generateEmbedFromData(config, m));
      else command.message.channel?.send(bot.extras.generateEmbedFromData(config, m));
    }

    const collector = mes.createMessageComponentCollector({
      filter: (i) => i.user.id == user.id,
      idle: 1000 * 60 * 20,
    });

    collector.on('collect', async (i) => {
      if (interaction.customId == 'setchannel') {
        await setChannel(interaction, schema);
      } else if (interaction.customId == 'deleteconfig') {
        await deleteConfig(interaction as unknown as StringSelectMenuInteraction, schema);
      }

      const option = setupConfig.options.find((i) => i.id == interaction.customId);
      if (option) setMessage(interaction, schema, option);
    });
  }

  async function setChannel(
    interaction:
      | ButtonInteraction
      | StringSelectMenuInteraction
      | UserSelectMenuInteraction
      | RoleSelectMenuInteraction
      | MentionableSelectMenuInteraction
      | ChannelSelectMenuInteraction,
    schema: any,
  ) {
    let success = false;
    let invalidResponse = false;

    while (!success) {
      if (!invalidResponse) {
        interaction.reply({
          content: `Please mention the channel or send cancel to cancel the setup.`,
          ephemeral: true,
        });
      } else {
        interaction.editReply({
          content: `You did not mention a channel. Please mention the channel or send cancel to cancel the setup.`,
        });
      }

      const message = (
        await interaction.channel?.awaitMessages({
          filter: (m) => m.author.id == user.id,
          max: 1,
          time: 30000,
        })
      )?.at(0);

      if (!message) return;

      if (message.content.toLowerCase() == 'cancel') {
        interaction.reply({
          content: `Setup cancelled.`,
          ephemeral: true,
        });

        return;
      }

      if (message.mentions.channels.size > 0) {
        success = true;

        message.delete();

        schema.Channel = message.mentions.channels.first()!.id;
        await schema.save();

        await interaction.followUp({
          content: `I have successfully updated the channel to <#${message.mentions.channels.first()!.id}>.`,
          flags: 1 << 6,
        });

        setupConfig.createCallback(message.mentions.channels.first() as unknown as TextChannel);
      } else {
        invalidResponse = true;
      }
    }
  }

  async function setMessage(
    interaction:
      | ButtonInteraction
      | StringSelectMenuInteraction
      | UserSelectMenuInteraction
      | RoleSelectMenuInteraction
      | MentionableSelectMenuInteraction
      | ChannelSelectMenuInteraction,
    schema: any,
    option: SetupWizardConfigOptions,
  ) {
    let success = false;
    let invalidResponse = false;

    while (!success) {
      if (!invalidResponse) {
        interaction.reply({
          content: `Please send the message content or send cancel to cancel the setup.`,
          ephemeral: true,
        });
      } else {
        interaction.editReply({
          content: `You did not send a valid message content. Please send the message content or send cancel to cancel the setup.`,
        });
      }

      const message = (
        await interaction.channel?.awaitMessages({
          filter: (m) => m.author.id == user.id,
          max: 1,
          time: 30000,
        })
      )?.at(0);

      if (!message) return;

      if (message.content.toLowerCase() == 'cancel') {
        interaction.reply({
          content: `Setup cancelled.`,
          ephemeral: true,
        });

        return;
      }

      if (message.content.length > 0) {
        success = true;

        message.delete();

        schema.Message = JSON.stringify({ content: message.content });
        await schema.save();

        await interaction.followUp({
          content: `I have successfully updated the level message.`,
          flags: 1 << 6,
        });
      } else {
        invalidResponse = true;
      }
    }
  }

  async function deleteConfig(interaction: StringSelectMenuInteraction, schema: any) {
    await schema.deleteOne({ _id: schema._id });

    await interaction.reply({
      content: `I have successfully deleted System ${interaction.values![0]}.`,
      ephemeral: true,
    });

    return sendMessage();
  }

  sendMessage();
}

type SetupWizardConfig = {
  createCallback: (channel?: TextChannel) => void;
  options: SetupWizardConfigOptions[];
};

type SetupWizardConfigOptions = {
  callback: () => void;
  id: string;
  schemaParam: string;
  name: string;
  default: string;
};
