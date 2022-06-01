module.exports = {
  verification: "",
  description:
    "Aeona is a multi-purpose chatbot powered by GPT-2 with moderation, AI based chat filtering, Images, Utilities, Reddit, Games, and much more!",
  domain: "https://www.aeona.xyz", // domain
  google_analitics: process.env.ANALYTICS, // google analitics
  token: process.env.BOTTOKEN,
  https: "https://", // leave as is
  port: process.env.PORT || 5000,
  
  client_id: process.env.ID, // bot client ID
  secret: process.env.SECERT, // bot client secret for auth
  main_token: process.env.BOTTOKEN,
  mongodb_url: process.env.MONGO_CONNECTION, //mongo db URL
  developers: ["794921502230577182", "394320584089010179"],
  dashboard: true,
  prefix: "+", //prefix
  arc: null, //arc.io source (optional)
  webhook_url: process.env.WEBHOOK_URL,
};

// for dashboard, read more on https://github.com/IgorKowalczyk/majobot
