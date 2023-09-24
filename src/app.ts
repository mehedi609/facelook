import express, { Express } from 'express';
import { ChattyServer } from './setupServer';
import { databaseConnection } from './setupDatabase';

class Application {
  public initialize(): void {
    databaseConnection();
    const expressApp: Express = express();
    const chattyServer: ChattyServer = new ChattyServer(expressApp);
    chattyServer.start();
  }
}

const application: Application = new Application();
application.initialize();
