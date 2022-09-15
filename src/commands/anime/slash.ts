import { Discord, SlashGroup,Slash, SlashOption } from "discordx";
import respond from "../../structures/respond.js";
import actions from "../../lib/anime/index.js";
import { ApplicationCommandOptionType, CommandInteraction, GuildMember } from "discord.js";

@Discord()
@SlashGroup({ name: "anime", description: "React using gifs" })
@SlashGroup({ name: "user", root: "anime" })

@SlashGroup("anime")
export class Anime {
  @Slash()
  @SlashGroup("user", "anime")
  async baka(
    @SlashOption({ name: "user", type: ApplicationCommandOptionType.User}) user: GuildMember,
    interaction: CommandInteraction
  ) {
    if(!interaction.inCachedGuild()) return;
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${user.displayName} is a baka`,
      authorIconUrl: interaction.member .displayAvatarURL(),
      imageURL: await actions.baka(),
    });
  }
  @Slash()
  @SlashGroup("user", "anime")
  async bite(
    @SlashOption({ name: "user", type: ApplicationCommandOptionType.User }) user: GuildMember,
    interaction: CommandInteraction
  ) {
    if(!interaction.inCachedGuild()) return;
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${interaction.member .displayName} bit ${user.displayName}`,
      authorIconUrl: interaction.member .displayAvatarURL(),
      imageURL: await actions.bite(),
    });
  }
  @Slash()
  async blush(interaction: CommandInteraction) {
    if(!interaction.inCachedGuild()) return;
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${interaction.member .displayName} is blushing O.O`,
      authorIconUrl: interaction.member .displayAvatarURL(),
      imageURL: await actions.blush(),
    });
  }

  @Slash()
  @SlashGroup("user", "anime")
  async bonk(
    @SlashOption({ name: "user", type: ApplicationCommandOptionType.User }) user: GuildMember,
    interaction: CommandInteraction
  ) {
    if(!interaction.inCachedGuild()) return;
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${interaction.member .displayName} bonked ${user.displayName}`,
      authorIconUrl: interaction.member .displayAvatarURL(),
      imageURL: await actions.bonk(),
    });
  }

  @Slash()
  async bored(interaction: CommandInteraction) {
    if(!interaction.inCachedGuild()) return;
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${interaction.member .displayName} is bored (○´―\`)ゞ`,
      authorIconUrl: interaction.member .displayAvatarURL(),
      imageURL: await actions.bored(),
    });
  }

  @Slash()
  @SlashGroup("user", "anime")
  async bully(
    @SlashOption({ name: "user", type: ApplicationCommandOptionType.User }) user: GuildMember,
    interaction: CommandInteraction
  ) {
    if(!interaction.inCachedGuild()) return;
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${user.displayName} is a bully (╬▔皿▔)╯`,
      authorIconUrl: interaction.member .displayAvatarURL(),
      imageURL: await actions.bully(),
    });
  }

  @Slash()
  async confused(interaction: CommandInteraction) {
    if(!interaction.inCachedGuild()) return;
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${interaction.member .displayName} is confused ＼（〇_ｏ）／`,
      authorIconUrl: interaction.member .displayAvatarURL(),
      imageURL: await actions.confused(),
    });
  }

  @Slash()
  async cry(interaction: CommandInteraction) {
    if(!interaction.inCachedGuild()) return;
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${interaction.member .displayName} is crying >:(`,
      authorIconUrl: interaction.member .displayAvatarURL(),
      imageURL: await actions.cry(),
    });
  }

  @Slash()
  async dance(interaction: CommandInteraction) {
    if(!interaction.inCachedGuild()) return;
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${interaction.member .displayName} is dancing 〜(￣▽￣〜)`,
      authorIconUrl: interaction.member .displayAvatarURL(),
      imageURL: await actions.dance(),
    });
  }

  @Slash()
  async goodnight(interaction: CommandInteraction) {
    if(!interaction.inCachedGuild()) return;
    await interaction.deferReply();

    respond(interaction, {
      // eslint-disable-next-line no-irregular-whitespace
      authorName: `${interaction.member .displayName} is going to sleep (_　_)。゜zｚＺ`,
      authorIconUrl: interaction.member .displayAvatarURL(),
      imageURL: await actions.goodnight(),
    });
  }

  @Slash()
  async happy(interaction: CommandInteraction) {
    if(!interaction.inCachedGuild()) return;
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${interaction.member .displayName} is happy []~(￣▽￣)~*`,
      authorIconUrl: interaction.member .displayAvatarURL(),
      imageURL: await actions.happy(),
    });
  }

  @Slash()
  @SlashGroup("user", "anime")
  async highfive(
    @SlashOption({ name: "user", type: ApplicationCommandOptionType.User }) user: GuildMember,
    interaction: CommandInteraction
  ) {
    if(!interaction.inCachedGuild()) return;
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${interaction.member .displayName} gave ${user.displayName} a high five (〃￣︶￣)人(￣︶￣〃)`,
      authorIconUrl: interaction.member .displayAvatarURL(),
      imageURL: await actions.highfive(),
    });
  }

  @Slash()
  @SlashGroup("user", "anime")
  async hug(
    @SlashOption({ name: "user", type: ApplicationCommandOptionType.User }) user: GuildMember,
    interaction: CommandInteraction
  ) {
    if(!interaction.inCachedGuild()) return;
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${user.displayName} got a hug from ${interaction.member .displayName}`,
      authorIconUrl: interaction.member .displayAvatarURL(),
      imageURL: await actions.hug(),
    });
  }


  @Slash()
  @SlashGroup("user", "anime")
  async kick(
    @SlashOption({ name: "user", type: ApplicationCommandOptionType.User }) user: GuildMember,
    interaction: CommandInteraction
  ) {
    if(!interaction.inCachedGuild()) return;
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${user.displayName} was kicked by ${interaction.member .displayName}`,
      authorIconUrl: interaction.member .displayAvatarURL(),
      imageURL: await actions.kick(),
    });
  }

  @Slash()
  @SlashGroup("user", "anime")
  async kiss(
    @SlashOption({ name: "user", type: ApplicationCommandOptionType.User }) user: GuildMember,
    interaction: CommandInteraction
  ) {
    if(!interaction.inCachedGuild()) return;
    await interaction.deferReply();


    respond(interaction, {
      authorName: `${user.displayName} shared a kiss with ${interaction.member .displayName}`,
      authorIconUrl: interaction.member .displayAvatarURL(),
      imageURL: await actions.kiss(),
    });
  }

  @Slash()
  @SlashGroup("user", "anime")
  async kill(
    @SlashOption({ name: "user", type: ApplicationCommandOptionType.User }) user: GuildMember,
    interaction: CommandInteraction
  ) {
    if(!interaction.inCachedGuild()) return;
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${user.displayName} was K.O by ${interaction.member .displayName}`,
      authorIconUrl: interaction.member .displayAvatarURL(),
      imageURL: await actions.bully(),
    });
  }

  @Slash()
  async nervous(interaction: CommandInteraction) {
    if(!interaction.inCachedGuild()) return;
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${interaction.member .displayName} is nervous ＼（〇_ｏ）／`,
      authorIconUrl: interaction.member .displayAvatarURL(),
      imageURL: await actions.nervous(),
    });
  }

  
  @Slash()
  @SlashGroup("user", "anime")
  async pat(
    @SlashOption({ name: "user", type: ApplicationCommandOptionType.User }) user: GuildMember,
    interaction: CommandInteraction
  ) {
    if(!interaction.inCachedGuild()) return;
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${user.displayName} got a pat from ${interaction.member .displayName}`,
      authorIconUrl: interaction.member .displayAvatarURL(),
      imageURL: await actions.pat(),
    });
  }

  
  @Slash()
  @SlashGroup("user", "anime")
  async poke(
    @SlashOption({ name: "user", type: ApplicationCommandOptionType.User }) user: GuildMember,
    interaction: CommandInteraction
  ) {
    if(!interaction.inCachedGuild()) return;
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${user.displayName} was poked by ${interaction.member .displayName}`,
      authorIconUrl: interaction.member .displayAvatarURL(),
      imageURL: await actions.poke(),
    });
  }

  
  @Slash()
  @SlashGroup("user", "anime")
  async punch(
    @SlashOption({ name: "user", type: ApplicationCommandOptionType.User }) user: GuildMember,
    interaction: CommandInteraction
  ) {
    if(!interaction.inCachedGuild()) return;
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${user.displayName} was punched by ${interaction.member .displayName}`,
      authorIconUrl: interaction.member .displayAvatarURL(),
      imageURL: await actions.punch(),
    });
  }
  
  @Slash()
  async sad(interaction: CommandInteraction) {
    if(!interaction.inCachedGuild()) return;
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${interaction.member .displayName} is sad <( _ _ )>`,
      authorIconUrl: interaction.member .displayAvatarURL(),
      imageURL: await actions.sad(),
    });
  }

  @Slash()
  async scream(interaction: CommandInteraction) {
    if(!interaction.inCachedGuild()) return;
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${interaction.member .displayName} is screaming ╰（‵□′）╯`,
      authorIconUrl: interaction.member .displayAvatarURL(),
      imageURL: await actions.scream(),
    });
  }

  @Slash()
  async slap(
    @SlashOption({ name: "user", type: ApplicationCommandOptionType.User }) user: GuildMember,
    interaction: CommandInteraction
  ) {
    if(!interaction.inCachedGuild()) return;
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${user.displayName} was slapped by ${interaction.member .displayName}`,
      authorIconUrl: interaction.member .displayAvatarURL(),
      imageURL: await actions.slap(),
    });
  }
  @Slash()
  async smile(interaction: CommandInteraction) {
    if(!interaction.inCachedGuild()) return;
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${interaction.member .displayName} is smiling (●ˇ∀ˇ●)`,
      authorIconUrl: interaction.member .displayAvatarURL(),
      imageURL: await actions.smile(),
    });
  }

  @Slash()
  async stare(interaction: CommandInteraction) {
    if(!interaction.inCachedGuild()) return;
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${interaction.member .displayName} is staring O_O`,
      authorIconUrl: interaction.member .displayAvatarURL(),
      imageURL: await actions.stare(),
    });
  }
  @Slash()
  async thinking(interaction: CommandInteraction) {
    if(!interaction.inCachedGuild()) return;
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${interaction.member .displayName} is thinking `,
      authorIconUrl: interaction.member .displayAvatarURL(),
      imageURL: await actions.thinking(),
    });
  }
  @Slash()
  async wave(interaction: CommandInteraction) {
    if(!interaction.inCachedGuild()) return;
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${interaction.member .displayName} is waving (≧∇≦)ﾉ`,
      authorIconUrl: interaction.member .displayAvatarURL(),
      imageURL: await actions.wave(),
    });
  }

  @Slash()
  async wink(interaction: CommandInteraction) {
    if(!interaction.inCachedGuild()) return;
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${interaction.member .displayName} winked`,
      authorIconUrl: interaction.member .displayAvatarURL(),
      imageURL: await actions.wink(),
    });
  }

  @Slash()
  async yeet(interaction: CommandInteraction) {
    if(!interaction.inCachedGuild()) return;
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${interaction.member .displayName} has yeeted something`,
      authorIconUrl: interaction.member .displayAvatarURL(),
      imageURL: await actions.yeet(),
    });
  }

  @Slash()
  async yes(interaction: CommandInteraction) {
    if(!interaction.inCachedGuild()) return;
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${interaction.member .displayName} agrees`,
      authorIconUrl: interaction.member .displayAvatarURL(),
      imageURL: await actions.yes(),
    });
  }
}
