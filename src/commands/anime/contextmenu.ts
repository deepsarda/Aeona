import { Discord, ContextMenu } from "discordx";
import type {
    UserContextMenuCommandInteraction,
    MessageContextMenuCommandInteraction
} from "discord.js";
import { ApplicationCommandType } from "discord.js";
import respond from "../../structures/respond.js";
import actions from "../../lib/anime/index.js";

@Discord()
export class Anime {
  
  
  @ContextMenu({
    name: "bonk",
    type: ApplicationCommandType.Message,
  })
  async bonk(interaction: MessageContextMenuCommandInteraction): Promise<void> {
    if(!interaction.inCachedGuild()) return;
    await interaction.deferReply();

    respond(interaction,{
      authorName: `${interaction.member.displayName} bonked ${interaction.targetMessage.member}`,
      authorIconUrl: interaction.member.displayAvatarURL(),
      imageURL: await actions.bonk()
    })
  }


  @ContextMenu({
    name: "bonk",
    type: ApplicationCommandType.User,
  })
  async bonkUser(interaction: UserContextMenuCommandInteraction): Promise<void> {
    if(!interaction.inCachedGuild()) return;
    await interaction.deferReply();
    
    respond(interaction,{
      title: `${interaction.member.displayName} bonked ${interaction.targetMember.displayName}`,
      imageURL: await actions.bonk()
    })
  }

  @ContextMenu({
    name: "bully",
    type: ApplicationCommandType.Message,
  })
  async bully(interaction: MessageContextMenuCommandInteraction): Promise<void> {
    if(!interaction.inCachedGuild()) return;
    await interaction.deferReply();

    respond(interaction,{
      authorName: `${interaction.member.displayName} is a bully :(`,
      authorIconUrl: interaction.member .displayAvatarURL(),
      imageURL: await actions.bully()
    })
  }


  @ContextMenu({
    name: "bully",
    type: ApplicationCommandType.User,
  })
  async bullyUser(interaction: UserContextMenuCommandInteraction): Promise<void> {
    if(!interaction.inCachedGuild()) return;
    await interaction.deferReply();

    respond(interaction,{
      title: `${interaction.targetMember .displayName} is a bully :(`,
      imageURL: await actions.bully()
    })
  }
  
  @ContextMenu({
    name: "confused",
    type: ApplicationCommandType.Message,
  })
  async confused(interaction: MessageContextMenuCommandInteraction): Promise<void> {
    if(!interaction.inCachedGuild()) return;
    await interaction.deferReply();

    respond(interaction,{
      authorName: `${interaction.member .displayName} is confused`,
      authorIconUrl: interaction.member .displayAvatarURL(),
      imageURL: await actions.confused()
    })
  }


  @ContextMenu({
    name: "confused",
    type: ApplicationCommandType.User,
  })
  async confusedUser(interaction: UserContextMenuCommandInteraction): Promise<void> {
    if(!interaction.inCachedGuild()) return;
    await interaction.deferReply();

    respond(interaction,{
      title: `${interaction.targetMember .displayName} is confused`,
      imageURL: await actions.confused()
    })
  }
  

  @ContextMenu({
    name: "goodnight",
    type: ApplicationCommandType.Message,
  })
  async goodnight(interaction: MessageContextMenuCommandInteraction): Promise<void> {
    if(!interaction.inCachedGuild()) return;
    await interaction.deferReply();

    respond(interaction,{
      authorName: `${interaction.member} is saying goodnight`,
      authorIconUrl: interaction.member .displayAvatarURL(),
      imageURL: await actions.goodnight()
    })
  }


  @ContextMenu({
    name: "goodnight",
    type: ApplicationCommandType.User,
  })
  async goodnightUser(interaction: UserContextMenuCommandInteraction): Promise<void> {
    if(!interaction.inCachedGuild()) return;
    await interaction.deferReply();

    respond(interaction,{
      title: `${interaction.targetMember .displayName} is saying goodnight`,
      imageURL: await actions.goodnight()
    })
  }
  
  @ContextMenu({
    name: "happy",
    type: ApplicationCommandType.Message,
  })
  async happy(interaction: MessageContextMenuCommandInteraction): Promise<void> {
    if(!interaction.inCachedGuild()) return;
    await interaction.deferReply();

    respond(interaction,{
      authorName: `${interaction.member} is happy []~(￣▽￣)~*`,
      authorIconUrl: interaction.member .displayAvatarURL(),
      imageURL: await actions.happy()
    })
  }


  @ContextMenu({
    name: "happy",
    type: ApplicationCommandType.User,
  })
  async happyUser(interaction: UserContextMenuCommandInteraction): Promise<void> {
    if(!interaction.inCachedGuild()) return;
    await interaction.deferReply();

    respond(interaction,{
      title: `${interaction.targetMember .displayName} is happy []~(￣▽￣)~*`,
      imageURL: await actions.happy()
    })
  }
}