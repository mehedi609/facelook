import mongoose from 'mongoose';
import { config } from './config';

export const databaseConnection = (): void => {
  const connect = async (): Promise<void> => {
    try {
      await mongoose.connect(config.DATABASE_URL);
      console.log('Connected to database');
    } catch (e) {
      console.log(`Error occurred while connecting to database ${e}}`);
      return process.exit(1);
    }
  };
  connect();

  mongoose.connection.on('disconnected', connect);
};
