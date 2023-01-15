import mongoose from 'mongoose';
import cachegoose from 'recachegoose';

export async function connect() {
  mongoose.connect(process.env.MONGO_CONNECTION!);
  cachegoose(mongoose, {
    engine: 'file',
  });
  mongoose.connection.once('open', () => {
    console.log(`System`.blue.bold, `>>`.white, `MongoDB`.red, `is ready!`.green);
  });
}
