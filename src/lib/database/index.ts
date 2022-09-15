import { connect } from 'mongoose';

run().catch((err) => console.log(err));

async function run() {
  await connect(process.env.MONGO_URL || "");
}

