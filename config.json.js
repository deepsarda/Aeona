module.exports = {
  main_token: process.env.TOKEN,
  mongodb_url: process.env.MONGO_CONNECTION, //mongo db URL
  developers: ["794921502230577182", "394320584089010179"],
  datadogApiKey: process.env.DATADOG, // for statistics (optional)
  dashboard: true,
  prefix: "+", //prefix
  arc: null, //arc.io source (optional)
  webhook_id: "",
  webhook_url: proccess.env.WEBHOOK_URL,
};
