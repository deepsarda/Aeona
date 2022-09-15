import { Schema, model } from 'mongoose';

type IAntiNuke = {
    ID: string;
    data:{
      all:{
        enabled:boolean;
        logger:string;
        whitelisted:{
          roles:[];
          users:[];
        }
        showwhitelistlog:boolean;
        quarantine:boolean;
      }
      antibot:{
        enabled:boolean;
        whitelisted:{
          roles:[];
          users:[];
        }
        punishment:{
          bot:{
            kick:boolean;
            ban: boolean;
          },
          member:{
            removeroles: IPunishmentHuman;
            kick:IPunishmentHuman;
            ban: IPunishmentHuman;
          }
        }
      }

      antideleteuser:{
        enabled:boolean;
        whitelisted:{
          roles:[];
          users:[];
        }
        punishment:{
          member:{
            removeroles: IPunishmentHuman;
            kick:IPunishmentHuman;
            ban: IPunishmentHuman;
          }
        }
      }

      anticreaterole:{
        enabled:boolean;
        whitelisted:{
          roles:[];
          users:[];
        }
        punishment:{
          removeaddedrole:boolean;
          member:{
            removeroles: IPunishmentHuman;
            kick:IPunishmentHuman;
            ban: IPunishmentHuman;
          }
        }
      }

      antideleterole:{
        enabled:boolean;
        whitelisted:{
          roles:[];
          users:[];
        }
        punishment:{
          readdrole:boolean;
          member:{
            removeroles: IPunishmentHuman;
            kick:IPunishmentHuman;
            ban: IPunishmentHuman;
          }
        }
      }

      antichanneldelete:{
        enabled:boolean;
        whitelisted:{
          roles:[];
          users:[];
        }
        punishment:{
          member:{
            removeroles: IPunishmentHuman;
            kick:IPunishmentHuman;
            ban: IPunishmentHuman;
          }
        }
      }

      antichannelcreate:{
        enabled:boolean;
        whitelisted:{
          roles:[];
          users:[];
        }
        punishment:{
          deletecreatedchannel:boolean;
          member:{
            removeroles: IPunishmentHuman;
            kick:IPunishmentHuman;
            ban: IPunishmentHuman;
          }
        }
      }
    }
  };

  type IPunishmentHuman= {
      neededdaycount: number;
      neededweekcount: number;
      neededmonthcount: number;
      noeededalltimecount: number;
      enabled:boolean;
  }
  
  const antiNukeSchema = new Schema<IAntiNuke>({
    ID: { type: String, required: true },
    data:{
      all:{
        enabled: { type: Boolean, required: false, default:false },
        logger:{ type: String, required: false, default:"no" },
        whitelisted:{
          roles:{ type: Array, required: false, default:[] },
          users:{ type: Array, required: false, default:[] },
        },
        showwhitelistlog:{ type: Boolean, required: false, default: true },
        quarantine:{ type: Boolean, required: false, default: false },
      },
      antibot:{
        enabled:{ type: Boolean, required: false , default:false },
        whitelisted:{
          roles:{ type: Array, required: false, default:[] },
          users:{ type: Array, required: false, default:[] },
        },
        punishment:{
          bot:{
            kick:{ type: Boolean, required: true },
            ban: { type: Boolean, required: true },
          },
          member:{
            removeroles: {
              neededdaycount:  { type: Number, required: false, default:1 },
              neededweekcount:  { type: Number, required: false, default: 4},
              neededmonthcount:  { type: Number, required: false,default: 10 },
              noeededalltimecount: { type: Number, required: false , default: 0 },
              enabled:{ type: Boolean, required: false, default:true }
            },
            kick:{
              neededdaycount:  { type: Number, required: false , default: 2},
              neededweekcount:  { type: Number, required: false, default: 7 },
              neededmonthcount:  { type: Number, required: false,default:  20},
              noeededalltimecount: { type: Number, required: false , default: 0 },
              enabled:{ type: Boolean, required: false, default:true }
            },
            ban: {
              neededdaycount:  { type: Number, required: false , default: 4},
              neededweekcount:  { type: Number, required: false, default: 10},
              neededmonthcount:  { type: Number, required: false,default:  25},
              noeededalltimecount: { type: Number, required: false , default: 0},
              enabled:{ type: Boolean, required: false, default:true }
            },
          }
        }
      },
      antideleteuser:{
        enabled:{ type: Boolean, required: false , default:false },
        whitelisted:{
          roles:{ type: Array, required: false, default:[] },
          users:{ type: Array, required: false, default:[] },
        },
        punishment:{
          member:{
            removeroles: {
              neededdaycount:  { type: Number, required: false, default:1 },
              neededweekcount:  { type: Number, required: false, default: 4},
              neededmonthcount:  { type: Number, required: false,default:  10},
              noeededalltimecount: { type: Number, required: false , default: 0},
              enabled:{ type: Boolean, required: false, default:true }
            },
            kick:{
              neededdaycount:  { type: Number, required: false, default:2 },
              neededweekcount:  { type: Number, required: false, default: 7},
              neededmonthcount:  { type: Number, required: false,default: 20 },
              noeededalltimecount: { type: Number, required: false , default: 0 },
              enabled:{ type: Boolean, required: false, default:true }
            },
            ban: {
              neededdaycount:  { type: Number, required: false , default: 4},
              neededweekcount:  { type: Number, required: false, default: 10},
              neededmonthcount:  { type: Number, required: false,default:  25},
              noeededalltimecount: { type: Number, required: false , default: 0},
              enabled:{ type: Boolean, required: false, default:true }
            },
          }
        }
      },

      anticreaterole:{
        enabled:{ type: Boolean, required: false , default:false },
        whitelisted:{
          roles:{ type: Array, required: false, default:[] },
          users:{ type: Array, required: false, default:[] },
        },
        punishment:{
          removeaddedrole:{ type: Boolean, required: true },
          member:{
            removeroles: {
              neededdaycount:  { type: Number, required: false , default: 1},
              neededweekcount:  { type: Number, required: false, default: 4},
              neededmonthcount:  { type: Number, required: false,default:  10},
              noeededalltimecount: { type: Number, required: false , default: 0 },
              enabled:{ type: Boolean, required: false, default:true }
            },
            kick:{
              neededdaycount:  { type: Number, required: false, default: 2},
              neededweekcount:  { type: Number, required: false, default: 7},
              neededmonthcount:  { type: Number, required: false,default:  20},
              noeededalltimecount: { type: Number, required: false , default: 0 },
              enabled:{ type: Boolean, required: false, default:true }
            },
            ban: {
              neededdaycount:  { type: Number, required: false, default: 4},
              neededweekcount:  { type: Number, required: false, default: 10},
              neededmonthcount:  { type: Number, required: false,default:  25},
              noeededalltimecount: { type: Number, required: false , default: 0 },
              enabled:{ type: Boolean, required: false, default:true }
            },
          }
        }
      },
      antideleterole:{
        enabled:{ type: Boolean, required: false , default:false },
        whitelisted:{
          roles:{ type: Array, required: false, default:[] },
          users:{ type: Array, required: false, default:[] },
        },
        punishment:{
          readdrole:{ type: Boolean, required: true },
          member:{
            removeroles: {
              neededdaycount:  { type: Number, required: false , default: 1},
              neededweekcount:  { type: Number, required: false, default: 4},
              neededmonthcount:  { type: Number, required: false,default:  10},
              noeededalltimecount: { type: Number, required: false , default: 0},
              enabled:{ type: Boolean, required: false, default:true }
            },
            kick:{
              neededdaycount:  { type: Number, required: false , default:2 },
              neededweekcount:  { type: Number, required: false, default: 7},
              neededmonthcount:  { type: Number, required: false,default:  20},
              noeededalltimecount: { type: Number, required: false , default: 0},
              enabled:{ type: Boolean, required: false, default:true }
            },
            ban: {
              neededdaycount:  { type: Number, required: false, default: 4},
              neededweekcount:  { type: Number, required: false, default: 10},
              neededmonthcount:  { type: Number, required: false,default:  25},
              noeededalltimecount: { type: Number, required: false , default: 0 },
              enabled:{ type: Boolean, required: false, default:true }
            },
          }
        }
      },

      antichanneldelete:{
        enabled:{ type: Boolean, required: false , default:false },
        whitelisted:{
          roles:{ type: Array, required: false, default:[] },
          users:{ type: Array, required: false, default:[] },
        },
        punishment:{
          member:{
            removeroles: {
              neededdaycount:  { type: Number, required: false , default: 1},
              neededweekcount:  { type: Number, required: false, default: 4},
              neededmonthcount:  { type: Number, required: false,default:  10},
              noeededalltimecount: { type: Number, required: false , default: 0},
              enabled:{ type: Boolean, required: false, default:true }
            },
            kick:{
              neededdaycount:  { type: Number, required: false , default:2 },
              neededweekcount:  { type: Number, required: false, default: 7},
              neededmonthcount:  { type: Number, required: false,default:  20},
              noeededalltimecount: { type: Number, required: false , default: 0},
              enabled:{ type: Boolean, required: false, default:true }
            },
            ban: {
              neededdaycount:  { type: Number, required: false, default: 4},
              neededweekcount:  { type: Number, required: false, default: 10},
              neededmonthcount:  { type: Number, required: false,default:  25},
              noeededalltimecount: { type: Number, required: false , default: 0 },
              enabled:{ type: Boolean, required: false, default:true }
            },
          }
        }
      },
      antichannelcreate:{
        enabled:{ type: Boolean, required: false , default:false },
        whitelisted:{
          roles:{ type: Array, required: false, default:[] },
          users:{ type: Array, required: false, default:[] },
        },
        punishment:{
          deletecreatedchannel:{ type: Boolean, required: true },
          member:{
            removeroles: {
              neededdaycount:  { type: Number, required: false , default: 1},
              neededweekcount:  { type: Number, required: false, default: 4},
              neededmonthcount:  { type: Number, required: false,default:  10},
              noeededalltimecount: { type: Number, required: false , default: 0},
              enabled:{ type: Boolean, required: false, default:true }
            },
            kick:{
              neededdaycount:  { type: Number, required: false , default:2 },
              neededweekcount:  { type: Number, required: false, default: 7},
              neededmonthcount:  { type: Number, required: false,default:  20},
              noeededalltimecount: { type: Number, required: false , default: 0},
              enabled:{ type: Boolean, required: false, default:true }
            },
            ban: {
              neededdaycount:  { type: Number, required: false, default: 4},
              neededweekcount:  { type: Number, required: false, default: 10},
              neededmonthcount:  { type: Number, required: false,default:  25},
              noeededalltimecount: { type: Number, required: false , default: 0 },
              enabled:{ type: Boolean, required: false, default:true }
            },
          }
        }
      }
    }
  });
  
  export default model<IAntiNuke>("anti_nuke_systems", antiNukeSchema);