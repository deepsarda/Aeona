import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: { type: String, required: true },
  Levels: { type: Boolean, default: false },
  AntiAlt: { type: Boolean, default: false },
  AntiSpam: { type: Boolean, default: false },
  AntiCaps: { type: Boolean, default: false },
  AntiInvite: { type: Boolean, default: false },
  AntiLinks: { type: Boolean, default: false },
  Prefix: String,
  Color: String,
  Premium: {
    RedeemedBy: {
      id: { type: mongoose.SchemaTypes.String, default: null },
      tag: { type: mongoose.SchemaTypes.String, default: null },
    },
    RedeemedAt: { type: mongoose.SchemaTypes.String, default: null },
    ExpiresAt: { type: mongoose.SchemaTypes.String, default: null },
    Plan: { type: mongoose.SchemaTypes.String, default: null },
  },
  isPremium: {
    type: mongoose.SchemaTypes.String,
    required: false,
    default: 'no',
  },
  chatbotFilter: { type: mongoose.SchemaTypes.Boolean, default: true },
});

export default mongoose.model('guild', Schema);
