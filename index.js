const AeonaClient = require("./Aeona");
const config = require("./config.json.js");
const domain = require("./config.js");

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

if (config.dashboard === "true") {
  const Dashboard = require("./dashboard/dashboard");
  Dashboard(client);
}

Aeona.start();

const http = require("https");
const os = require("os");
const AutoGitUpdate = require("auto-git-update");
function randomString(length, chars) {
 var result = "";
 for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
 return result;
}

let updating = false;
let tempDir = os.tmpdir();
const autoUpdateConfig = {
 repository: "https://github.com/deepsarda/Aeona",
 fromReleases: false,
 tempLocation: tempDir,
 ignoreFiles: [],
 executeOnComplete: "",
 exitOnComplete: true,
};

const updater = new AutoGitUpdate(autoUpdateConfig);
setInterval(async () => {
 const options = {
  method: "GET",
  hostname: "dumbotapi.aeona.repl.co",
  port: null,
  path: encodeURI("/?" + `test=i&text=${randomString(32, "0123456789abcdefghijklmnopqrstuvwxyz")}&userId=sfdsfsdf&key=${process.env.apiKey}`),
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

 if (updating) return;
 updating = true;

 await updater.autoUpdate();
 updating = false;
}, 60 * 1000);
