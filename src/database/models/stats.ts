import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  Guild: { type: String, required: true },
  Members: String,
  Boost: String,
  Channels: String,
  Roles: String,
  Emojis: String,
  AnimatedEmojis: String,
  NewsChannels: String,
  StageChannels: String,
  StaticEmojis: String,
  TextChannels: String,
  BoostTier: String,
  VoiceChannels: String,
  Bots: String,
  Time: String,
  TimeZone: String,
  ChannelTemplate: String,
});

export default mongoose.model('stats', Schema);
