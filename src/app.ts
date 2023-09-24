import express, { Express } from 'express';
import { ChattyServer } from './setupServer';

class Application {
  public initialize(): void {
    const expressApp: Express = express();
    const chattyServer: ChattyServer = new ChattyServer(expressApp);
    chattyServer.start();
  }
}

const application: Application = new Application();
application.initialize();
