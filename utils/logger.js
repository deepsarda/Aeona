const Discord = require("discord.js");
function timestamp() {
  let now = new Date();
  let hour = now.getHours();
  let minute = now.getMinutes();
  let stringHour = hour > 9 ? hour : `0${hour}`;
  let stringMinute = minute > 9 ? minute : `0${minute}`;
  return `[${stringHour}:${stringMinute}]`;
}

function Webhook(url) {
  let webhook = new Discord.WebhookClient({ url });

  return (message) => {
    webhook.send(message);
  };
}

/**
 * Wrap Console Functions
 * @param {string} [appName] Identifer to use in the logs
 * @param {string} [webhookURL] The URL for the Webhook
 * @return {void} `void`
 */
function DiscordLogger(appName, webhookURL) {
  let webhook = webhookURL ? Webhook(webhookURL) : null;

  let builtins = {
    log: console.log,
    warn: console.warn,
    error: console.error,
  };

  for (let printFunction in builtins) {
    console[printFunction] = function () {
      let prefix =
        timestamp() +
        (appName ? `[${appName}]` : "") +
        `[${printFunction.toUpperCase()}]`;
      builtins[printFunction].apply(console, [prefix, ...arguments]);
      if (webhook) {
        let message = [...arguments]
          .reduce((accumulator, current) => {
            return accumulator + current.toString() + "      ";
          }, "")
          .trim();

        webhook(`${prefix} ${message}`);
      }
    };
  }
}

module.exports = DiscordLogger;
