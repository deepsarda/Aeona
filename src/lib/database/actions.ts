import { Schema, model } from 'mongoose';

type IActions = {
    ID: string;
    data:{
      user:string;
      guild:string;
      type: string;
      moderator: string;
      reason: string;
      when: string;
      oldhighesrole:string;
      oldthumburl:string;
    }
  };
  
  const actionsSchema = new Schema<IActions>({
    ID: { type: String, required: true },
    data:{
      user: { type: String, required: true },
      guild: { type: String, required: true },
      type:  { type: String, required: true },
      moderator:  { type: String, required: true },
      reason:  { type: String, required: true },
      when:  { type: String, required: true },
      oldhighesrole: { type: String, required: true },
      oldthumburl: { type: String, required: true }
    }
  });
  
export default model<IActions>("actions", actionsSchema);
  