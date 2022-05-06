const mongoose = require("mongoose");
const config = require("../config.json.js");
const { mongodb } = require("./variables");
const logger = require("../utils/logger");

module.exports = {
  init: () => {
    if (!config.mongodb_url)
      logger.error(
        `Database failed to load - Required environment variable "mongodb_url" is not set.`,
        { label: "Database" }
      );
    mongoose
      .connect(mongodb, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      })
      .catch((e) => {
        logger.error(e.message, { label: "Database" });
        this.database = null;
      });
    mongoose.Promise = global.Promise;

    mongoose.connection.on("err", (err) => {
      logger.error(`Mongoose connection error: ${err.stack}`, {
        label: "Database",
      });
    });

    mongoose.connection.on("disconnected", () => {
      logger.error(`Mongoose connection lost`, { label: "Database" });
    });
  },
};
