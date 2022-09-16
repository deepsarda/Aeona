import { Discord, SimpleCommandOption, SimpleCommand, SimpleCommandMessage, SimpleCommandOptionType } from "discordx";
import respond from "../../structures/respond.js";
import actions from "../../lib/anime/index.js";
import { GuildMember } from "discord.js";
import { Category, Description } from "@discordx/utilities";

@Discord()
@Category("Anime")
export class Anime {
  @SimpleCommand()
  @Description("That user is a baka")
  async baka(
    @SimpleCommandOption({ name: "user", type: SimpleCommandOptionType.User }) user: GuildMember,
    interaction: SimpleCommandMessage
  ) {
    if (!interaction.isValid()) return interaction.sendUsageSyntax();
    respond(interaction, {
      authorName: `${user.displayName} is a baka`,
      authorIconUrl: interaction.message.member?.displayAvatarURL(),
      imageURL: await actions.baka(),
    });
  }
  @SimpleCommand()
  @Description("Bite a user")
  async bite(
    @SimpleCommandOption({ name: "user", type: SimpleCommandOptionType.User }) user: GuildMember,
    interaction: SimpleCommandMessage
  ) {
    if (!interaction.isValid()) return interaction.sendUsageSyntax();

    respond(interaction, {
      authorName: `${interaction.message.member?.displayName} bit ${user.displayName}`,
      authorIconUrl: interaction.message.member?.displayAvatarURL(),
      imageURL: await actions.bite(),
    });
  }
  @SimpleCommand()
  @Description("Show that you are blushing")
  async blush(interaction: SimpleCommandMessage) {
    respond(interaction, {
      authorName: `${interaction.message.member?.displayName} is blushing O.O`,
      authorIconUrl: interaction.message.member?.displayAvatarURL(),
      imageURL: await actions.blush(),
    });
  }

  @SimpleCommand()
  @Description("Bonk a user")
  async bonk(
    @SimpleCommandOption({ name: "user", type: SimpleCommandOptionType.User }) user: GuildMember,
    interaction: SimpleCommandMessage
  ) {
    if (!interaction.isValid()) return interaction.sendUsageSyntax();

    respond(interaction, {
      authorName: `${interaction.message.member?.displayName} bonked ${user.displayName}`,
      authorIconUrl: interaction.message.member?.displayAvatarURL(),
      imageURL: await actions.bonk(),
    });
  }

  @SimpleCommand()
  @Description("Show that you are bored")
  async bored(interaction: SimpleCommandMessage) {
    respond(interaction, {
      authorName: `${interaction.message.member?.displayName} is bored (○´―\`)ゞ`,
      authorIconUrl: interaction.message.member?.displayAvatarURL(),
      imageURL: await actions.bored(),
    });
  }

  @SimpleCommand()
  @Description("They are a bully")
  async bully(
    @SimpleCommandOption({ name: "user", type: SimpleCommandOptionType.User }) user: GuildMember,
    interaction: SimpleCommandMessage
  ) {
    if (!interaction.isValid()) return interaction.sendUsageSyntax();
    respond(interaction, {
      authorName: `${user.displayName} is a bully (╬▔皿▔)╯`,
      authorIconUrl: interaction.message.member?.displayAvatarURL(),
      imageURL: await actions.bully(),
    });
  }

  @SimpleCommand()
  @Description("Show that you are confused")
  async confused(interaction: SimpleCommandMessage) {
    respond(interaction, {
      authorName: `${interaction.message.member?.displayName} is confused ＼（〇_ｏ）／`,
      authorIconUrl: interaction.message.member?.displayAvatarURL(),
      imageURL: await actions.confused(),
    });
  }

  @SimpleCommand()
  @Description("Show that you are crying")
  async cry(interaction: SimpleCommandMessage) {
    respond(interaction, {
      authorName: `${interaction.message.member?.displayName} is crying >:(`,
      authorIconUrl: interaction.message.member?.displayAvatarURL(),
      imageURL: await actions.cry(),
    });
  }

  @SimpleCommand()
  @Description("Dance your life away")
  async dance(interaction: SimpleCommandMessage) {
    respond(interaction, {
      authorName: `${interaction.message.member?.displayName} is dancing 〜(￣▽￣〜)`,
      authorIconUrl: interaction.message.member?.displayAvatarURL(),
      imageURL: await actions.dance(),
    });
  }

  @SimpleCommand()
  @Description("Show that you are blushing")
  async goodnight(interaction: SimpleCommandMessage) {
    respond(interaction, {
      // eslint-disable-next-line no-irregular-whitespace
      authorName: `${interaction.message.member?.displayName} is going to sleep (_　_)。゜zｚＺ`,
      authorIconUrl: interaction.message.member?.displayAvatarURL(),
      imageURL: await actions.goodnight(),
    });
  }

  @SimpleCommand()
  @Description("Show that you are happy")
  async happy(interaction: SimpleCommandMessage) {
    respond(interaction, {
      authorName: `${interaction.message.member?.displayName} is happy []~(￣▽￣)~*`,
      authorIconUrl: interaction.message.member?.displayAvatarURL(),
      imageURL: await actions.happy(),
    });
  }

  @SimpleCommand()
  @Description("High Five with an user")
  async highfive(
    @SimpleCommandOption({ name: "user", type: SimpleCommandOptionType.User }) user: GuildMember,
    interaction: SimpleCommandMessage
  ) {
    if (!interaction.isValid()) return interaction.sendUsageSyntax();

    respond(interaction, {
      authorName: `${interaction.message.member?.displayName} gave ${user.displayName} a high five (〃￣︶￣)人(￣︶￣〃)`,
      authorIconUrl: interaction.message.member?.displayAvatarURL(),
      imageURL: await actions.highfive(),
    });
  }

  @SimpleCommand()
  @Description("Hug an user")
  async hug(
    @SimpleCommandOption({ name: "user", type: SimpleCommandOptionType.User }) user: GuildMember,
    interaction: SimpleCommandMessage
  ) {
    if (!interaction.isValid()) return interaction.sendUsageSyntax();

    respond(interaction, {
      authorName: `${user.displayName} got a hug from ${interaction.message.member?.displayName}`,
      authorIconUrl: interaction.message.member?.displayAvatarURL(),
      imageURL: await actions.hug(),
    });
  }

  @SimpleCommand()
  @Description("Kick an user")
  async kick(
    @SimpleCommandOption({ name: "user", type: SimpleCommandOptionType.User }) user: GuildMember,
    interaction: SimpleCommandMessage
  ) {
    if (!interaction.isValid()) return interaction.sendUsageSyntax();

    respond(interaction, {
      authorName: `${user.displayName} was kicked by ${interaction.message.member?.displayName}`,
      authorIconUrl: interaction.message.member?.displayAvatarURL(),
      imageURL: await actions.kick(),
    });
  }

  @SimpleCommand()
  @Description("Kiss an user")
  async kiss(
    @SimpleCommandOption({ name: "user", type: SimpleCommandOptionType.User }) user: GuildMember,
    interaction: SimpleCommandMessage
  ) {
    if (!interaction.isValid()) return interaction.sendUsageSyntax();

    respond(interaction, {
      authorName: `${user.displayName} shared a kiss with ${interaction.message.member?.displayName}`,
      authorIconUrl: interaction.message.member?.displayAvatarURL(),
      imageURL: await actions.kiss(),
    });
  }

  @SimpleCommand()
  @Description("Kill an user")
  async kill(
    @SimpleCommandOption({ name: "user", type: SimpleCommandOptionType.User }) user: GuildMember,
    interaction: SimpleCommandMessage
  ) {
    if (!interaction.isValid()) return interaction.sendUsageSyntax();

    respond(interaction, {
      authorName: `${user.displayName} was K.O by ${interaction.message.member?.displayName}`,
      authorIconUrl: interaction.message.member?.displayAvatarURL(),
      imageURL: await actions.bully(),
    });
  }

  @SimpleCommand()
  @Description("Show that you are nervous")
  async nervous(interaction: SimpleCommandMessage) {
    respond(interaction, {
      authorName: `${interaction.message.member?.displayName} is nervous ＼（〇_ｏ）／`,
      authorIconUrl: interaction.message.member?.displayAvatarURL(),
      imageURL: await actions.nervous(),
    });
  }

  @SimpleCommand()
  @Description("Hug an user")
  async pat(
    @SimpleCommandOption({ name: "user", type: SimpleCommandOptionType.User }) user: GuildMember,
    interaction: SimpleCommandMessage
  ) {
    if (!interaction.isValid()) return interaction.sendUsageSyntax();

    respond(interaction, {
      authorName: `${user.displayName} got a pat from ${interaction.message.member?.displayName}`,
      authorIconUrl: interaction.message.member?.displayAvatarURL(),
      imageURL: await actions.pat(),
    });
  }

  @SimpleCommand()
  @Description("Poke an user")
  async poke(
    @SimpleCommandOption({ name: "user", type: SimpleCommandOptionType.User }) user: GuildMember,
    interaction: SimpleCommandMessage
  ) {
    respond(interaction, {
      authorName: `${user.displayName} was poked by ${interaction.message.member?.displayName}`,
      authorIconUrl: interaction.message.member?.displayAvatarURL(),
      imageURL: await actions.poke(),
    });
  }

  @SimpleCommand()
  @Description("Punch an user")
  async punch(
    @SimpleCommandOption({ name: "user", type: SimpleCommandOptionType.User }) user: GuildMember,
    interaction: SimpleCommandMessage
  ) {
    if (!interaction.isValid()) return interaction.sendUsageSyntax();

    respond(interaction, {
      authorName: `${user.displayName} was punched by ${interaction.message.member?.displayName}`,
      authorIconUrl: interaction.message.member?.displayAvatarURL(),
      imageURL: await actions.punch(),
    });
  }

  @SimpleCommand()
  @Description("Show that you are sad")
  async sad(interaction: SimpleCommandMessage) {
    respond(interaction, {
      authorName: `${interaction.message.member?.displayName} is sad <( _ _ )>`,
      authorIconUrl: interaction.message.member?.displayAvatarURL(),
      imageURL: await actions.sad(),
    });
  }

  @SimpleCommand()
  @Description("Internal Screaming")
  async scream(interaction: SimpleCommandMessage) {
    respond(interaction, {
      authorName: `${interaction.message.member?.displayName} is screaming ╰（‵□′）╯`,
      authorIconUrl: interaction.message.member?.displayAvatarURL(),
      imageURL: await actions.scream(),
    });
  }

  @SimpleCommand()
  @Description("Slap an user")
  async slap(
    @SimpleCommandOption({ name: "user", type: SimpleCommandOptionType.User }) user: GuildMember,
    interaction: SimpleCommandMessage
  ) {
    if (!interaction.isValid()) return interaction.sendUsageSyntax();

    respond(interaction, {
      authorName: `${user.displayName} was slapped by ${interaction.message.member?.displayName}`,
      authorIconUrl: interaction.message.member?.displayAvatarURL(),
      imageURL: await actions.slap(),
    });
  }
  @SimpleCommand()
  @Description("Smile at an user")
  async smile(interaction: SimpleCommandMessage) {
    respond(interaction, {
      authorName: `${interaction.message.member?.displayName} is smiling (●ˇ∀ˇ●)`,
      authorIconUrl: interaction.message.member?.displayAvatarURL(),
      imageURL: await actions.smile(),
    });
  }

  @SimpleCommand()
  @Description("Stare")
  async stare(interaction: SimpleCommandMessage) {
    respond(interaction, {
      authorName: `${interaction.message.member?.displayName} is staring O_O`,
      authorIconUrl: interaction.message.member?.displayAvatarURL(),
      imageURL: await actions.stare(),
    });
  }
  @SimpleCommand()
  @Description("Think. Hmmmmm")
  async thinking(interaction: SimpleCommandMessage) {
    respond(interaction, {
      authorName: `${interaction.message.member?.displayName} is thinking `,
      authorIconUrl: interaction.message.member?.displayAvatarURL(),
      imageURL: await actions.thinking(),
    });
  }
  @SimpleCommand()
  @Description("Wave, just smile and wave")
  async wave(interaction: SimpleCommandMessage) {
    respond(interaction, {
      authorName: `${interaction.message.member?.displayName} is waving (≧∇≦)ﾉ`,
      authorIconUrl: interaction.message.member?.displayAvatarURL(),
      imageURL: await actions.wave(),
    });
  }

  @SimpleCommand()
  @Description("Wink")
  async wink(interaction: SimpleCommandMessage) {
    respond(interaction, {
      authorName: `${interaction.message.member?.displayName} winked`,
      authorIconUrl: interaction.message.member?.displayAvatarURL(),
      imageURL: await actions.wink(),
    });
  }

  @SimpleCommand()
  @Description("Yeet something")
  async yeet(interaction: SimpleCommandMessage) {
    respond(interaction, {
      authorName: `${interaction.message.member?.displayName} has yeeted something`,
      authorIconUrl: interaction.message.member?.displayAvatarURL(),
      imageURL: await actions.yeet(),
    });
  }

  @SimpleCommand()
  @Description("Show that you agree")
  async yes(interaction: SimpleCommandMessage) {
    respond(interaction, {
      authorName: `${interaction.message.member?.displayName} agrees`,
      authorIconUrl: interaction.message.member?.displayAvatarURL(),
      imageURL: await actions.yes(),
    });
  }
}
