const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf } = format;
const Discord = require("discord.js");
const config = require("../config.json.js");
const webhookClient = new Discord.WebhookClient({
  url: "https://discord.com/api/webhooks/971701276888936480/7o7CAK21Y4W4z2xEWqdYiWL24T5o-ljS0nmGQfKs0TPm1g5ISbQqIMbzJ7HJ90suExcW",
});
const chalk = require("chalk");

const myFormat = printf(({ level, message, label, timestamp }) => {
  webhookClient.send(`${timestamp} [${label}] ${message}`);
  return `${timestamp} [${level}] [${chalk.cyan(label)}] ${message}`;
});

const myCustomLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  },
};

const logger = createLogger({
  levels: myCustomLevels.levels,
  format: combine(
    format.colorize(),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    myFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "./assets/logs/Aeona.log" }),
  ],
});

module.exports = logger;
