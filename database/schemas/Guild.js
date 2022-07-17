const { channel } = require("diagnostics_channel");
const mongoose = require("mongoose");

const guildConfigSchema = mongoose.Schema({
  guildId: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true,
  },
  prefix: {
    type: mongoose.SchemaTypes.String,
    required: true,
    default: "+",
  },
  isPremium: {
    type: mongoose.SchemaTypes.String,
    required: false,
    default: false,
  },
  aiAutoMod: {
    type: mongoose.SchemaTypes.Boolean,
    required: false,
    default: false,
  },
  globalChatChannel: {
    type: mongoose.SchemaTypes.String,
    required: false,
    default: null,
  },
  chatbot: {
    alwaysOnChannel: {
      type: mongoose.SchemaTypes.String,
      required: false,
      default: null,
    },
    disabledChannels: {
      type: mongoose.SchemaTypes.Array,
      required: false,
      default: [],
    },
    chatbot: {
      type: mongoose.SchemaTypes.String,
      required: false,
      default: "deepparag/Aeona",
    },
  },
  leveling: {
    enabled: {
      type: mongoose.SchemaTypes.Boolean,
      required: false,
      default: false,
    },
    levelUpMessage: {
      type: mongoose.SchemaTypes.String,
      required: false,
      default: "{user} has leveled up to level {level}! :tada:",
    },
    levelUpChannel: {
      type: mongoose.SchemaTypes.String,
      required: false,
      default: null,
    },
    roles: [
      {
        role: {
          type: mongoose.SchemaTypes.String,
          required: false,
          default: "0",
        },
        level: {
          type: mongoose.SchemaTypes.Number,
          required: false,
          default: 0,
        },
      },
    ],
  },
  verification: {
    enabled: {
      type: mongoose.SchemaTypes.Boolean,
      required: false,
      default: false,
    },
    verificationChannel: {
      type: mongoose.SchemaTypes.String,
      required: false,
      default: null,
    },
    verificationRole: {
      type: mongoose.SchemaTypes.String,
      required: false,
      default: null,
    }
  },

  bump: {
    enabled: {
      type: mongoose.SchemaTypes.Boolean,
      required: false,
      default: false,
    },
    bumpMessage: {
      type: mongoose.SchemaTypes.String,
      required: false,
      default: "Hello! Please bump us!",
    },
    lastBump: {
      type: mongoose.SchemaTypes.Number,
      required: false,
      default: 0,
    },
    reminded: {
      type: mongoose.SchemaTypes.Boolean,
      required: false,
      default: true,
    },
    channel: {
      type: mongoose.SchemaTypes.String,
      required: false,
      default: null,
    },
  },
  premium: {
    redeemedBy: {
      id: { type: mongoose.SchemaTypes.String, default: null },
      tag: { type: mongoose.SchemaTypes.String, default: null },
    },

    redeemedAt: { type: mongoose.SchemaTypes.String, default: null },

    expiresAt: { type: mongoose.SchemaTypes.String, default: null },

    plan: { type: mongoose.SchemaTypes.String, default: null },
  },
  logChannelID: {
    type: mongoose.SchemaTypes.String,
    required: false,
  },
  modlogcolor: {
    type: mongoose.SchemaTypes.String,
    required: false,
    default: "#000000",
  },
  greetChannelID: {
    type: mongoose.SchemaTypes.String,
    required: false,
  },
  farewellChannelID: {
    type: mongoose.SchemaTypes.String,
    required: false,
  },
  antiInvites: {
    type: mongoose.SchemaTypes.Boolean,
  },
  antiLinks: {
    type: mongoose.SchemaTypes.Boolean,
  },
  leaves: {
    type: mongoose.SchemaTypes.Array,
    default: [],
  },
  suggestion: {
    suggestionChannelID: {
      type: mongoose.SchemaTypes.String,
      required: false,
      default: null,
    },
    suggestioncolor: {
      type: mongoose.SchemaTypes.String,
      required: false,
      default: "#000000",
    },
    suggestionlogChannelID: {
      type: mongoose.SchemaTypes.String,
      required: false,
      default: null,
    },
    decline: {
      type: mongoose.SchemaTypes.String,
      required: false,
      default: true,
    },
    deleteSuggestion: {
      type: mongoose.SchemaTypes.String,
      required: false,
      default: true,
    },
    description: {
      type: mongoose.SchemaTypes.String,
      required: false,
      default: `{suggestion}`,
    },
    footer: {
      type: mongoose.SchemaTypes.String,
      required: false,
      default: `Suggested by {user_tag}`,
    },
    timestamp: {
      type: mongoose.SchemaTypes.String,
      required: false,
      default: false,
    },
    reaction: {
      type: mongoose.SchemaTypes.String,
      required: false,
      default: `1`,
    },
  },
  reactionDM: {
    type: Boolean,
    default: true,
  },
  reactionLogs: {
    type: mongoose.SchemaTypes.String,
    default: null,
    required: false,
  },
  reactionColor: {
    type: mongoose.SchemaTypes.String,
    default: "#000000",
    required: false,
  },
  autoroleID: {
    type: mongoose.SchemaTypes.String,
    required: false,
    default: null,
  },
  autoroleToggle: {
    type: Boolean,
    required: false,
    default: false,
  },
});

module.exports = mongoose.model("guild", guildConfigSchema);
