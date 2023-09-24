import mongoose from 'mongoose';

export const databaseConnection = (): void => {
  const connect = async (): Promise<void> => {
    try {
      await mongoose.connect(
        (process.env.MONGO_URI as string) ||
          'mongodb://127.0.0.1:27017/chattyDB',
      );
      console.log('Connected to database');
    } catch (e) {
      console.log(`Error occurred while connecting to database ${e}}`);
      return process.exit(1);
    }
  };
  connect();

  mongoose.connection.on('disconnected', connect);
};
