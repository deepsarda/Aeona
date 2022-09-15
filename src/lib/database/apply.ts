import { Schema, model } from "mongoose";

type IApply = {
  ID: string;
  data: IApplyQuestionFormat[];
};
type IApplyQuestionFormat = {
  channel_id: string;
  applytype: string;
  message_id: string;
  f_channel_id: string;
  questions: [];
  temprole:string;
  accept: string;
  accept_role: string;
  deny: string;
  ticket: string;
};



const applySchema = new Schema<IApply>({
  ID: { type: String, required: true },
  data: [{
    channel_id: { type: String, required: true },
    applytype: { type: String, required: false, default:"normal" },
    message_id: { type: String, required: true },
    moderator: { type: String, required: true },
    f_channel_id: { type: String, required: true },
    questions: { type: Array, required: false,default:[] },
    temprole:{type:String, required:false, default:"0"},
    accept: { type: String, required: false, default: "You've got accepted!" },
    accept_role: { type: String, required: false, default:"0" },
    deny: { type: String, required: false, default: "You've got denied!" },
    ticket: { type: String, required: false, default: "Hey {user}! We have some Questions!" },
  }],
});

export default model<IApply>("apply", applySchema);
