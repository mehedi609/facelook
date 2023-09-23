import { Application } from 'express';
import { Server } from 'http';

export class ChattyServer {
  constructor(private app: Application) {}

  public start(): void {
    this.securtyMiddlewares(this.app);
    this.standardMiddlewares(this.app);
    this.routeMiddlewares(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
  }

  private securtyMiddlewares(app: Application): void {}

  private standardMiddlewares(app: Application): void {}

  private routeMiddlewares(app: Application): void {}

  private globalErrorHandler(app: Application): void {}

  private startServer(app: Application): void {}

  private createSocketIO(httpServer: Server): void {}

  private startHttpServer(httpServer: Server): void {}
}
