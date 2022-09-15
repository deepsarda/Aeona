import { Schema, model } from 'mongoose';

type IAfk={
    ID:string;
    data:{
        stamp: string;
        REMIND:IRemind[];
        quotes:IQuote[];
    }
}

type IRemind={
    at: string;
    time: number;
    timestamp: number;
    content: string;
    channel: string;
    guild: string;
    user: string;
    string_of_time: string;
}

type IQuote={
    at: number;
    by: string;
    image: string;
    text: string;
}


const afkSchema = new Schema<IAfk>({
    ID: { type: String, required: true },
    data:{
        stamp: { type: String, required: false },
        REMIND: { type: Array, required: false},
        quotes: { type: Array, required: false}
    }
});

export default model<IAfk>("afkdbs",afkSchema);


