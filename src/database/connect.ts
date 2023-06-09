import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import cachegoose from 'recachegoose';

export async function connect() {
  cachegoose(mongoose, {
    engine: 'file',
  });
  mongoose.connection.once('open', () => {
    console.log(
      `System`.blue.bold,
      `>>`.white,
      `MongoDB`.red,
      `is ready!`.green,
    );
  });
  if (process.env.DEV === 'true') {
    const mongod = await MongoMemoryServer.create();
    mongoose.connect(mongod.getUri());
    console.log(
      `System`.blue.bold,
      `>>`.white,
      `MongoDB Test Server`.red,
      `Intialised`.green,
    );
  } else {
    mongoose.connect(process.env.MONGO_CONNECTION!);
  }
}
