import express, { Express } from 'express';
import { ChattyServer } from './setupServer';
import { databaseConnection } from './setupDatabase';
import { config } from './config';

class Application {
  public initialize(): void {
    this.loadConfig();
    databaseConnection();
    const expressApp: Express = express();
    const chattyServer: ChattyServer = new ChattyServer(expressApp);
    chattyServer.start();
  }

  private loadConfig(): void {
    config.validateConfig();
  }
}

const application: Application = new Application();
application.initialize();
