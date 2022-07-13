module.exports = {
  verification: "",
  description: "Aeona is a friendly neighbourhood multi-purpose chatbot. ",
  domain: process.env.DEV ? "http://localhost:8000" : process.env.domain, // domain
  google_analitics: process.env.ANALYTICS, // google analitics
  token: process.env.BOTTOKEN,
  https: "https://", // leave as is
  port: process.env.PORT || 5000,
  top_gg_autoposter: process.env.TOKEN,
  client_id: process.env.ID, // bot client ID
  secret: process.env.SECERT, // bot client secret for auth
  main_token: process.env.BOTTOKEN,
  mongodb_url: process.env.MONGO_CONNECTION, //mongo db URL
  developers: ["794921502230577182", "394320584089010179"],
  dashboard: true,
  prefix: "+", //prefix
  arc: null, //arc.io source (optional)
  webhook_url: process.env.WEBHOOK_URL,
  logs_webhook_url: process.env.logs,
};
