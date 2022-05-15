const AeonaClient = require("./Aeona");
const config = require("./config.json.js");
const domain = require("./config.js");
const logger = require("./utils/logger");
const Aeona = new AeonaClient(config);

const color = require("./data/colors");
Aeona.color = color;

Aeona.domain = domain.domain || `https://Aeona.xyz`;

const emoji = require("./data/emoji");
Aeona.emoji = emoji;

let client = Aeona;
const jointocreate = require("./structures/jointocreate");
jointocreate(client);

Aeona.react = new Map();
Aeona.fetchforguild = new Map();

if (config.dashboard) {
  const Dashboard = require("./dashboard/dashboard");
  Dashboard(client);
}

Aeona.start();
process.on("uncaughtException", (error) => {
  logger.error(error);

 
});
const http = require("https");
function randomString(length, chars) {
  var result = "";
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
setInterval(() => {
  const options = {
    method: "GET",
    hostname: "dumbotapi.aeona.repl.co",
    port: null,
    path: encodeURI(
      "/?" +
        `test=i&text=${randomString(
          32,
          "0123456789abcdefghijklmnopqrstuvwxyz"
        )}&userId=sfdsfsdf&key=${process.env.apiKey}`
    ),
  };
  const req = http.request(options, (res) => {
    const chunks = [];
    req.on("error", function (e) {
      console.log(e);
    });

    req.on("timeout", function () {
      console.log("timeout");
      req.abort();
    });
    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", async function () {
      const body = Buffer.concat(chunks);
      var reply = body.toString();
      console.log("Pinging AI: Reply recived: " + reply);
    });
  });
  req.end();
}, 60 * 1000 * 5);
