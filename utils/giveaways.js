module.exports = (client) => {
  const mongoose = require("mongoose");

  const giveawaySchema = new mongoose.Schema(
    {
      messageId: String,
      channelId: String,
      guildId: String,
      startAt: Number,
      endAt: Number,
      ended: Boolean,
      winnerCount: Number,
      prize: String,
      messages: {
        giveaway: String,
        giveawayEnded: String,
        inviteToParticipate: String,
        drawing: String,
        dropMessage: String,
        winMessage: mongoose.Mixed,
        embedFooter: mongoose.Mixed,
        noWinner: String,
        winners: String,
        endedAt: String,
        hostedBy: String,
      },
      thumbnail: String,
      image: String,
      hostedBy: String,
      winnerIds: { type: [String], default: undefined },
      reaction: mongoose.Mixed,
      botsCanWin: Boolean,
      embedColor: mongoose.Mixed,
      embedColorEnd: mongoose.Mixed,
      exemptPermissions: { type: [], default: undefined },
      exemptMembers: String,
      bonusEntries: String,
      extraData: mongoose.Mixed,
      lastChance: {
        enabled: Boolean,
        content: String,
        threshold: Number,
        embedColor: mongoose.Mixed,
      },
      pauseOptions: {
        isPaused: Boolean,
        content: String,
        unPauseAfter: Number,
        embedColor: mongoose.Mixed,
        durationAfterPause: Number,
        infiniteDurationText: String,
      },
      isDrop: Boolean,
      allowedMentions: {
        parse: { type: [String], default: undefined },
        users: { type: [String], default: undefined },
        roles: { type: [String], default: undefined },
      },
    },
    { id: false }
  );

  // Create the model
  const giveawayModel = mongoose.model("giveaways", giveawaySchema);

  const { GiveawaysManager } = require("discord-giveaways");
  const GiveawayManagerWithOwnDatabase = class extends GiveawaysManager {
    // This function is called when the manager needs to get all giveaways which are stored in the database.
    async getAllGiveaways() {
      // Get all giveaways from the database. We fetch all documents by passing an empty condition.
      return await giveawayModel.find().lean().exec();
    }

    // This function is called when a giveaway needs to be saved in the database.
    async saveGiveaway(messageId, giveawayData) {
      // Add the new giveaway to the database
      await giveawayModel.create(giveawayData);
      // Don't forget to return something!
      return true;
    }

    // This function is called when a giveaway needs to be edited in the database.
    async editGiveaway(messageId, giveawayData) {
      // Find by messageId and update it
      await giveawayModel
        .updateOne({ messageId }, giveawayData, { omitUndefined: true })
        .exec();
      // Don't forget to return something!
      return true;
    }

    // This function is called when a giveaway needs to be deleted from the database.
    async deleteGiveaway(messageId) {
      // Find by messageId and delete it
      await giveawayModel.deleteOne({ messageId }).exec();
      // Don't forget to return something!
      return true;
    }
  };

  // Create a new instance of your new class
  const manager = new GiveawayManagerWithOwnDatabase(client, {
    updateCountdownEvery: 10000,
    hasGuildMembersIntent: true,
    embedColorEnd: "15859772",
    embedColor: "#ab4b52",
    default: {
      botsCanWin: false,
      // exemptPermissions: ["MANAGE_MESSAGES", "ADMINISTRATOR"],
      reaction: "🎉",
    },
  });

  return manager;
};
