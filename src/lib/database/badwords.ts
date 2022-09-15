import { Schema, model } from "mongoose";

type IBadWords = {
  ID: string;
  data: {
    words: [];
    mute_amount: number;
    whitelistedchannels: [];
  };
};

const badWordsSchema = new Schema<IBadWords>({
  ID: { type: String, required: true },
  data: {
    words: { type: Array, required: false, default: [] },
    mute_amount: { type: Number, required: false, default: 5 },
    whitelistedchannels: { type: Array, required: false, default: [] },
  },
});

export default model<IBadWords>("blacklists", badWordsSchema);
