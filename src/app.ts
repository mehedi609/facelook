import express, { Express } from 'express';
import { ChattyServer } from '@root/setupServer';
import { databaseConnection } from '@root/setupDatabase';
import { config } from '@root/config';

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
