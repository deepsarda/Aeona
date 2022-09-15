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
    @SlashOption({ name: "user", type: ApplicationCommandOptionType.User, required: false }) user: GuildMember,
    interaction: CommandInteraction
  ) {
    await interaction.deferReply();

    if (!user && interaction.member) user = interaction.member as GuildMember;

    respond(interaction, {
      authorName: `${user.displayName} is a baka`,
      authorIconUrl: (interaction.member as GuildMember).displayAvatarURL(),
      imageURL: await actions.baka(),
    });
  }
  @Slash()
  @SlashGroup("user", "anime")
  async bite(
    @SlashOption({ name: "user", type: ApplicationCommandOptionType.User }) user: GuildMember,
    interaction: CommandInteraction
  ) {
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${(interaction.member as GuildMember).displayName} bit ${user.displayName}`,
      authorIconUrl: (interaction.member as GuildMember).displayAvatarURL(),
      imageURL: await actions.bite(),
    });
  }
  @Slash()
  async blush(interaction: CommandInteraction) {
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${(interaction.member as GuildMember).displayName} is blushing O.O`,
      authorIconUrl: (interaction.member as GuildMember).displayAvatarURL(),
      imageURL: await actions.blush(),
    });
  }

  @Slash()
  @SlashGroup("user", "anime")
  async bonk(
    @SlashOption({ name: "user", type: ApplicationCommandOptionType.User }) user: GuildMember,
    interaction: CommandInteraction
  ) {
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${(interaction.member as GuildMember).displayName} bonked ${user.displayName}`,
      authorIconUrl: (interaction.member as GuildMember).displayAvatarURL(),
      imageURL: await actions.bonk(),
    });
  }

  @Slash()
  async bored(interaction: CommandInteraction) {
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${(interaction.member as GuildMember).displayName} is bored (○´―\`)ゞ`,
      authorIconUrl: (interaction.member as GuildMember).displayAvatarURL(),
      imageURL: await actions.bored(),
    });
  }

  @Slash()
  @SlashGroup("user", "anime")
  async bully(
    @SlashOption({ name: "user", type: ApplicationCommandOptionType.User }) user: GuildMember,
    interaction: CommandInteraction
  ) {
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${user.displayName} is a bully (╬▔皿▔)╯`,
      authorIconUrl: (interaction.member as GuildMember).displayAvatarURL(),
      imageURL: await actions.bully(),
    });
  }

  @Slash()
  async confused(interaction: CommandInteraction) {
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${(interaction.member as GuildMember).displayName} is confused ＼（〇_ｏ）／`,
      authorIconUrl: (interaction.member as GuildMember).displayAvatarURL(),
      imageURL: await actions.confused(),
    });
  }

  @Slash()
  async cry(interaction: CommandInteraction) {
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${(interaction.member as GuildMember).displayName} is crying >:(`,
      authorIconUrl: (interaction.member as GuildMember).displayAvatarURL(),
      imageURL: await actions.cry(),
    });
  }

  @Slash()
  async dance(interaction: CommandInteraction) {
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${(interaction.member as GuildMember).displayName} is dancing 〜(￣▽￣〜)`,
      authorIconUrl: (interaction.member as GuildMember).displayAvatarURL(),
      imageURL: await actions.dance(),
    });
  }

  @Slash()
  async goodnight(interaction: CommandInteraction) {
    await interaction.deferReply();

    respond(interaction, {
      // eslint-disable-next-line no-irregular-whitespace
      authorName: `${(interaction.member as GuildMember).displayName} is going to sleep (_　_)。゜zｚＺ`,
      authorIconUrl: (interaction.member as GuildMember).displayAvatarURL(),
      imageURL: await actions.goodnight(),
    });
  }

  @Slash()
  async happy(interaction: CommandInteraction) {
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${(interaction.member as GuildMember).displayName} is happy []~(￣▽￣)~*`,
      authorIconUrl: (interaction.member as GuildMember).displayAvatarURL(),
      imageURL: await actions.happy(),
    });
  }

  @Slash()
  @SlashGroup("user", "anime")
  async highfive(
    @SlashOption({ name: "user", type: ApplicationCommandOptionType.User }) user: GuildMember,
    interaction: CommandInteraction
  ) {
    await interaction.deferReply();

    

    respond(interaction, {
      authorName: `${(interaction.member as GuildMember).displayName} gave ${user.displayName} a high five (〃￣︶￣)人(￣︶￣〃)`,
      authorIconUrl: (interaction.member as GuildMember).displayAvatarURL(),
      imageURL: await actions.highfive(),
    });
  }

  @Slash()
  @SlashGroup("user", "anime")
  async hug(
    @SlashOption({ name: "user", type: ApplicationCommandOptionType.User }) user: GuildMember,
    interaction: CommandInteraction
  ) {
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${user.displayName} got a hug from ${(interaction.member as GuildMember).displayName}`,
      authorIconUrl: (interaction.member as GuildMember).displayAvatarURL(),
      imageURL: await actions.hug(),
    });
  }


  @Slash()
  @SlashGroup("user", "anime")
  async kick(
    @SlashOption({ name: "user", type: ApplicationCommandOptionType.User }) user: GuildMember,
    interaction: CommandInteraction
  ) {
    await interaction.deferReply();

    if (!user && interaction.member) user = interaction.member as GuildMember;

    respond(interaction, {
      authorName: `${user.displayName} was kicked by ${(interaction.member as GuildMember).displayName}`,
      authorIconUrl: (interaction.member as GuildMember).displayAvatarURL(),
      imageURL: await actions.kick(),
    });
  }

  @Slash()
  @SlashGroup("user", "anime")
  async kiss(
    @SlashOption({ name: "user", type: ApplicationCommandOptionType.User }) user: GuildMember,
    interaction: CommandInteraction
  ) {
    await interaction.deferReply();

    if (!user && interaction.member) user = interaction.member as GuildMember;

    respond(interaction, {
      authorName: `${user.displayName} shared a kiss with ${(interaction.member as GuildMember).displayName}`,
      authorIconUrl: (interaction.member as GuildMember).displayAvatarURL(),
      imageURL: await actions.kiss(),
    });
  }

  @Slash()
  @SlashGroup("user", "anime")
  async kill(
    @SlashOption({ name: "user", type: ApplicationCommandOptionType.User }) user: GuildMember,
    interaction: CommandInteraction
  ) {
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${user.displayName} was K.O by ${(interaction.member as GuildMember).displayName}`,
      authorIconUrl: (interaction.member as GuildMember).displayAvatarURL(),
      imageURL: await actions.bully(),
    });
  }

  @Slash()
  async nervous(interaction: CommandInteraction) {
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${(interaction.member as GuildMember).displayName} is nervous ＼（〇_ｏ）／`,
      authorIconUrl: (interaction.member as GuildMember).displayAvatarURL(),
      imageURL: await actions.nervous(),
    });
  }

  
  @Slash()
  @SlashGroup("user", "anime")
  async pat(
    @SlashOption({ name: "user", type: ApplicationCommandOptionType.User }) user: GuildMember,
    interaction: CommandInteraction
  ) {
    await interaction.deferReply();

    if (!user && interaction.member) user = interaction.member as GuildMember;

    respond(interaction, {
      authorName: `${user.displayName} got a pat from ${(interaction.member as GuildMember).displayName}`,
      authorIconUrl: (interaction.member as GuildMember).displayAvatarURL(),
      imageURL: await actions.pat(),
    });
  }

  
  @Slash()
  @SlashGroup("user", "anime")
  async poke(
    @SlashOption({ name: "user", type: ApplicationCommandOptionType.User }) user: GuildMember,
    interaction: CommandInteraction
  ) {
    await interaction.deferReply();

    if (!user && interaction.member) user = interaction.member as GuildMember;

    respond(interaction, {
      authorName: `${user.displayName} was poked by ${(interaction.member as GuildMember).displayName}`,
      authorIconUrl: (interaction.member as GuildMember).displayAvatarURL(),
      imageURL: await actions.poke(),
    });
  }

  
  @Slash()
  @SlashGroup("user", "anime")
  async punch(
    @SlashOption({ name: "user", type: ApplicationCommandOptionType.User }) user: GuildMember,
    interaction: CommandInteraction
  ) {
    await interaction.deferReply();

    if (!user && interaction.member) user = interaction.member as GuildMember;

    respond(interaction, {
      authorName: `${user.displayName} was punched by ${(interaction.member as GuildMember).displayName}`,
      authorIconUrl: (interaction.member as GuildMember).displayAvatarURL(),
      imageURL: await actions.punch(),
    });
  }
  
  @Slash()
  async sad(interaction: CommandInteraction) {
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${(interaction.member as GuildMember).displayName} is sad <( _ _ )>`,
      authorIconUrl: (interaction.member as GuildMember).displayAvatarURL(),
      imageURL: await actions.sad(),
    });
  }

  @Slash()
  async scream(interaction: CommandInteraction) {
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${(interaction.member as GuildMember).displayName} is screaming ╰（‵□′）╯`,
      authorIconUrl: (interaction.member as GuildMember).displayAvatarURL(),
      imageURL: await actions.scream(),
    });
  }

  @Slash()
  async slap(
    @SlashOption({ name: "user", type: ApplicationCommandOptionType.User }) user: GuildMember,
    interaction: CommandInteraction
  ) {
    await interaction.deferReply();

    if (!user && interaction.member) user = interaction.member as GuildMember;

    respond(interaction, {
      authorName: `${user.displayName} was slapped by ${(interaction.member as GuildMember).displayName}`,
      authorIconUrl: (interaction.member as GuildMember).displayAvatarURL(),
      imageURL: await actions.slap(),
    });
  }
  @Slash()
  async smile(interaction: CommandInteraction) {
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${(interaction.member as GuildMember).displayName} is smiling (●ˇ∀ˇ●)`,
      authorIconUrl: (interaction.member as GuildMember).displayAvatarURL(),
      imageURL: await actions.smile(),
    });
  }

  @Slash()
  async stare(interaction: CommandInteraction) {
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${(interaction.member as GuildMember).displayName} is staring O_O`,
      authorIconUrl: (interaction.member as GuildMember).displayAvatarURL(),
      imageURL: await actions.stare(),
    });
  }
  @Slash()
  async thinking(interaction: CommandInteraction) {
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${(interaction.member as GuildMember).displayName} is thinking `,
      authorIconUrl: (interaction.member as GuildMember).displayAvatarURL(),
      imageURL: await actions.thinking(),
    });
  }
  @Slash()
  async wave(interaction: CommandInteraction) {
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${(interaction.member as GuildMember).displayName} is waving (≧∇≦)ﾉ`,
      authorIconUrl: (interaction.member as GuildMember).displayAvatarURL(),
      imageURL: await actions.wave(),
    });
  }

  @Slash()
  async wink(interaction: CommandInteraction) {
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${(interaction.member as GuildMember).displayName} winked`,
      authorIconUrl: (interaction.member as GuildMember).displayAvatarURL(),
      imageURL: await actions.wink(),
    });
  }

  @Slash()
  async yeet(interaction: CommandInteraction) {
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${(interaction.member as GuildMember).displayName} has yeeted something`,
      authorIconUrl: (interaction.member as GuildMember).displayAvatarURL(),
      imageURL: await actions.yeet(),
    });
  }

  @Slash()
  async yes(interaction: CommandInteraction) {
    await interaction.deferReply();

    respond(interaction, {
      authorName: `${(interaction.member as GuildMember).displayName} agrees`,
      authorIconUrl: (interaction.member as GuildMember).displayAvatarURL(),
      imageURL: await actions.yes(),
    });
  }
}
