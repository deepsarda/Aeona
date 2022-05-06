module.exports = {
  main_token: process.env.BOTTOKEN,
  mongodb_url: process.env.MONGO_CONNECTION, //mongo db URL
  developers: ["794921502230577182", "394320584089010179"],
  dashboard: true,
  prefix: "+", //prefix
  arc: null, //arc.io source (optional)
  webhook_url: process.env.WEBHOOK_URL,
};
