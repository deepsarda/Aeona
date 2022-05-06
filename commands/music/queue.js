const Command = require("../../structures/Command");
const { MessageEmbed, Message, CommandInteraction } = require("discord.js");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "queue",
      aliases: ["playlist"],
      description: "View the queue.",
      category: "Music",
      cooldown: 3,
      usage: "",
    });
  }
  async run(message, args) {
    const page = args.length && Number(args[0]) ? Number(args[0]) : 1;
    const response = getQueue(message, page);
    await message.reply(response);
  }
};

function getQueue({ client, guild }, pgNo) {
  const player = client.musicManager.get(guild.id);
  if (!player) return "🚫 There is no music playing in this guild.";

  const queue = player.queue;
  const embed = new MessageEmbed().setAuthor({
    name: `Queue for ${guild.name}, use +queue [page number] to change pages`,
  });

  // change for the amount of tracks per page
  const multiple = 10;
  const page = pgNo || 1;

  const end = page * multiple;
  const start = end - multiple;

  const tracks = queue.slice(start, end);

  if (queue.current)
    embed.addField("Current", `[${queue.current.title}](${queue.current.uri})`);
  if (!tracks.length)
    embed.setDescription(
      `No tracks in ${page > 1 ? `page ${page}` : "the queue"}.`
    );
  else
    embed.setDescription(
      tracks
        .map((track, i) => `${start + ++i} - [${track.title}](${track.uri})`)
        .join("\n")
    );

  const maxPages = Math.ceil(queue.length / multiple);

  embed.setFooter({
    text: `Page ${page > maxPages ? maxPages : page} of ${maxPages}`,
  });

  return { embeds: [embed] };
}
