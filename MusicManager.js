const { Manager } = require("erela.js");
const Deezer = require("erela.js-deezer");
const Facebook = require("erela.js-facebook");
const Spotify = require("erela.js-spotify");

module.exports = class MusicManager extends Manager {
  constructor(client) {
    const plugins = [
      new Deezer({
        albumLimit: 1,
        playlistLimit: 1,
      }),

      new Facebook(),
    ];

    if (process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET) {
      plugins.push(
        new Spotify({
          clientID: process.env.SPOTIFY_CLIENT_ID,
          clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
          albumLimit: 1,
          playlistLimit: 1,
        })
      );
    }

    super({
      nodes: [
        {
          host: "lavalink-replit.aeona.repl.co",
          port: 443,
          password: "maybeiwasboring",
          identifier: "USA Link",
          retryDelay: 5000,
          secure: true,
        },
      ],
      autoPlay: true,
      plugins,

      send: (id, payload) => {
        const guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
      },
    });
  }
};
