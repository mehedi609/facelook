import mongoose from 'mongoose';
import bunyan from 'bunyan';
import { config } from './config';

const logger: bunyan = config.createLogger('setupDatabase');
export const databaseConnection = (): void => {
  const connect = async (): Promise<void> => {
    try {
      await mongoose.connect(config.DATABASE_URL);
      logger.info('Connected to database');
    } catch (e) {
      logger.error(`Error occurred while connecting to database ${e}}`);
      return process.exit(1);
    }
  };
  connect();

  mongoose.connection.on('disconnected', connect);
};
