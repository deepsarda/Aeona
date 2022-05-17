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
          host: "usa.lavalink.mitask.tech",
          port: 2333,
          password: "lvserver",
          identifier: "USA Link",
          retryDelay: 5000,
          secure: false,
        },
        {
          host: "lavalink.oops.wtf",
          port: 2000,
          password: "www.freelavalink.ga",
          identifier: "lavalink.oops.wtf Link",
          retryDelay: 5000,
          secure: false,
        },
        {
          host: "https://lavalink-replit.aeona.repl.co",
          port: 433,
          password: "maybeiwasboring",
          identifier: "Aeona Link",
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
