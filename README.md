# Aeona | Chatbot

[![Discord Bots](https://top.gg/api/widget/931226824753700934.svg)](https://top.gg/bot/931226824753700934)

Aeona is an ever-growing multipurpose bot; primarily a fun chatbot you can converse with, but also showcases a wide range of _fun commands to pass time_, an **ever-expanding** _economy system_

## Chatbot

Aeona offers a _fun, interactive chatbot_, which is triggered everytime the **bot is mentioned**, or when a messages starts with the word **aeona**.

The Chatbot AI is constantly being updated and _learns from the messages you send, to make it more lifelike_ using a new technology that combines **Generative AI** & **Search Fist AI**.

## Server Utilities

Aeona has several commands to truly improve the quality of your server, such as:

- `>reactionrole` → Allows you to setup reaction roles
- **Suggestion commands** → Allows users to make suggestions, and admins to accept or reject them
- `>ghostping` & `>modlog` → Helps moderators keep a check on the server
- `>poll` → Allows users to vote on important server topics

## Economy

Aeona supports an extensive, vast economy system to explore and have fun with when your server is inactive, or you just feel like it :)

- Ever updating shop with numerous items
- Numerous jobs to earn credits through (you can apply for all jobs)
- Game commands to spend/bet the money
- And much more..

## Misc

Aeona also has **multiple** miscellaneous commands, such as:

- `>snipe` & `>editsnipe` → To view the most recently deleted and edited messages
- **Reaction commands** under the _anime_ section to emote to your friends in style!
- `>reddit` to view posts from various subreddits
- Various image commands to view avatars, banners, cute pet images, and so on..

### So that's about it for Aeona. This bot is still in its early stages after verification, so you can be sure to expect loads of new changes and updates very soon

## Setting Up

Your `config.json` should look like this:

```
{
  "main_token": process.env.token,
  "mongodb_url": "", //mongo db URL
  "developers": ["", ""], //developers ID
  "dashboard":"true",
  "prefix":"+", //prefix
  "webhook_id":"", //read config.json
  "webhook_url":"" //read config.json
}

```

Your `config.js` should look like this:

```
module.exports = {
 "verification": "",
 "description": "", //description
 "domain": "", // domain
 "google_analitics": "", // google analitics
 "token": process.env.TOKEN,
 "https":"https://", // leave as is
 "port":"5003",

 "client_id":"", // bot client ID
 "secret":""// bot client secret for auth

}
```

Your `.env` file should be:

```
importantLogs=Webhook Url
ANALYTICS=Google anaylatics key
STATCORD=Statcord key
SECERT=Client OAUTH2 Secert
logs=Webhook Url
PORT=8000
TOKEN=TOP.gg token
SPOTIFY_CLIENT_SECRET=Spotify client deverloper Secert for music
rateLimit=Webhook Url
apiKey= get api key from https://rapidapi.com/multiii/api/aeona3/ look for X-RapidAPI-Key.
errors=Webhook Url
ID=Bot Client Id
WEBHOOK_URL=Webhook Url
SPOTIFY_CLIENT_ID=Spotify client deverloper ID for music
MONGO_CONNECTION=mongodb connection url
BOTTOKEN=BOT Token
reports=Webhook Url for bug reports etc
```

# If you need help join [support server](https://www.aeeona.xyz/support)

### for dashboard set up read https://github.com/IgorKowalczyk/majobot

**callbacks on auth dev portal:**
`https://domain/callback`
`https://domain/window`
`https://domain/thanks`

Pease make sure you have enabled `Privileged Intents` on your Discord [developer portal](https://discordapp.com/developers/applications/). You can find these intents under the "Bot" section, and there are two ticks you have to switch on. For more information on Gateway Intents, check out [this](https://discordjs.guide/popular-topics/intents.html#the-intents-bit-field-wrapper) link.

You can launch the bot with `node shard.js`

**Important Note:** Pogy has so many bugs and requires a lot of js knowledge. You will have some difficulty running the bot if you have no experience in discord.js.

### Emojis

- You can change the emojis in: <br>
  1- `assets/emojis.json` <br>
  2- `data/emoji.js`

### Colors

- You can change the colors in `data/colors.js`

Credits to <https://github.com/WLegit/Pogy> for base bot code

## Commits By User

[![Readme Card](https://github-readme-stats.vercel.app/api/pin/?username=deepsarda&repo=aeona&theme=radical&show_icons=true&show_owner=true)](https://github.com/deepsarda/Aeona)
