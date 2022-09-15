import { Discord, ContextMenu } from "discordx";
import type {
    UserContextMenuCommandInteraction,
    MessageContextMenuCommandInteraction,
    GuildMember
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
    await interaction.deferReply();

    respond(interaction,{
      authorName: `${(interaction.member as GuildMember).displayName} bonked ${interaction.targetMessage.member}`,
      authorIconUrl: (interaction.member as GuildMember).displayAvatarURL(),
      imageURL: await actions.bonk()
    })
  }


  @ContextMenu({
    name: "bonk",
    type: ApplicationCommandType.User,
  })
  async bonkUser(interaction: UserContextMenuCommandInteraction): Promise<void> {
    
    await interaction.deferReply();

    respond(interaction,{
      title: `${(interaction.member as GuildMember).displayName} bonked ${(interaction.targetMember as GuildMember).displayName}`,
      imageURL: await actions.bonk()
    })
  }

  @ContextMenu({
    name: "bully",
    type: ApplicationCommandType.Message,
  })
  async bully(interaction: MessageContextMenuCommandInteraction): Promise<void> {
    await interaction.deferReply();

    respond(interaction,{
      authorName: `${(interaction.member as GuildMember).displayName} is a bully :(`,
      authorIconUrl: (interaction.member as GuildMember).displayAvatarURL(),
      imageURL: await actions.bully()
    })
  }


  @ContextMenu({
    name: "bully",
    type: ApplicationCommandType.User,
  })
  async bullyUser(interaction: UserContextMenuCommandInteraction): Promise<void> {
    
    await interaction.deferReply();

    respond(interaction,{
      title: `${(interaction.targetMember as GuildMember).displayName} is a bully :(`,
      imageURL: await actions.bully()
    })
  }
  
  @ContextMenu({
    name: "confused",
    type: ApplicationCommandType.Message,
  })
  async confused(interaction: MessageContextMenuCommandInteraction): Promise<void> {
    await interaction.deferReply();

    respond(interaction,{
      authorName: `${(interaction.member as GuildMember).displayName} is confused`,
      authorIconUrl: (interaction.member as GuildMember).displayAvatarURL(),
      imageURL: await actions.confused()
    })
  }


  @ContextMenu({
    name: "confused",
    type: ApplicationCommandType.User,
  })
  async confusedUser(interaction: UserContextMenuCommandInteraction): Promise<void> {
    
    await interaction.deferReply();

    respond(interaction,{
      title: `${(interaction.targetMember as GuildMember).displayName} is confused`,
      imageURL: await actions.confused()
    })
  }
  

  @ContextMenu({
    name: "goodnight",
    type: ApplicationCommandType.Message,
  })
  async goodnight(interaction: MessageContextMenuCommandInteraction): Promise<void> {
    await interaction.deferReply();

    respond(interaction,{
      authorName: `${interaction.member} is saying goodnight`,
      authorIconUrl: (interaction.member as GuildMember).displayAvatarURL(),
      imageURL: await actions.goodnight()
    })
  }


  @ContextMenu({
    name: "goodnight",
    type: ApplicationCommandType.User,
  })
  async goodnightUser(interaction: UserContextMenuCommandInteraction): Promise<void> {
    
    await interaction.deferReply();

    respond(interaction,{
      title: `${(interaction.targetMember as GuildMember).displayName} is saying goodnight`,
      imageURL: await actions.goodnight()
    })
  }
  
  @ContextMenu({
    name: "happy",
    type: ApplicationCommandType.Message,
  })
  async happy(interaction: MessageContextMenuCommandInteraction): Promise<void> {
    await interaction.deferReply();

    respond(interaction,{
      authorName: `${interaction.member} is happy []~(￣▽￣)~*`,
      authorIconUrl: (interaction.member as GuildMember).displayAvatarURL(),
      imageURL: await actions.happy()
    })
  }


  @ContextMenu({
    name: "happy",
    type: ApplicationCommandType.User,
  })
  async happyUser(interaction: UserContextMenuCommandInteraction): Promise<void> {
    
    await interaction.deferReply();

    respond(interaction,{
      title: `${(interaction.targetMember as GuildMember).displayName} is happy []~(￣▽￣)~*`,
      imageURL: await actions.happy()
    })
  }
}