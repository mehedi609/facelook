import { Application, json, urlencoded } from 'express';
import { Server } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';
import cookieSession from 'cookie-session';
import HTTP_STATUS from 'http-status-codes';
import 'express-async-errors';

export class ChattyServer {
  constructor(private app: Application) {}

  public start(): void {
    this.securityMiddlewares(this.app);
    this.standardMiddlewares(this.app);
    this.routeMiddlewares(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
  }

  private securityMiddlewares(app: Application): void {
    app.use(
      cookieSession({
        name: 'session',
        keys: ['key1', 'key2'],
        maxAge: 365 * 24 * 60 * 60 * 1000, // 365 days
        secure: false,
      }),
    );
    app.use(helmet());
    app.use(hpp());
    app.use(
      cors({
        origin: 'http://localhost:3000',
        credentials: true,
        optionsSuccessStatus: HTTP_STATUS.OK,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      }),
    );
  }

  private standardMiddlewares(app: Application): void {
    app.use(compression());
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));
  }

  private routeMiddlewares(app: Application): void {}

  private globalErrorHandler(app: Application): void {}

  private startServer(app: Application): void {}

  private createSocketIO(httpServer: Server): void {}

  private startHttpServer(httpServer: Server): void {}
}
