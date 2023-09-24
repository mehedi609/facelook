import { Application, json, urlencoded } from 'express';
import { Server as HttpServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';
import cookieSession from 'cookie-session';
import HTTP_STATUS from 'http-status-codes';
import 'express-async-errors';

export class ChattyServer {
  private PORT: number = Number(process.env.PORT) || 5000;
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

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: HttpServer = new HttpServer(app);
      this.startHttpServer(httpServer);
    } catch (e) {
      console.log(e);
    }
  }

  private createSocketIO(httpServer: HttpServer): void {}

  private startHttpServer(httpServer: HttpServer): void {
    httpServer.listen(this.PORT, () => {
      console.log(`Server is running on port ${this.PORT}`);
    });
  }
}
