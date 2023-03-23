import dotenv from 'dotenv';

export const envs = {
  ...process.env,
  ...dotenv.config().parsed,
};
