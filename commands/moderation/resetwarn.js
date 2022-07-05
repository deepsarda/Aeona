const { MessageEmbed } = require("discord.js");
const warnModel = require("../../database/schemas/moderation.js");
const Logging = require("../../database/schemas/logging.js");


module.exports = {
    name: "resetwarn",
    description: "Reset all the warnings from a specific user",
    