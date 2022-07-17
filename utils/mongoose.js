const mongoose = require("mongoose");
const config = require("./config");

module.exports = {
  init: () => {
    if (!config.mongodb_url)
      console.error(
        `Database failed to load - Required environment variable "mongodb_url" is not set.`
      );
    mongoose
      .connect(config.mongodb_url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      })
      .catch((e) => {
        console.error(e.message);
        this.database = null;
      });
    mongoose.Promise = global.Promise;

    mongoose.connection.on("err", (err) => {
      console.error(`Mongoose connection error: ${err.stack}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.error(`Mongoose connection lost`);
    });
  },
};
