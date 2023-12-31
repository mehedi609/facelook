import { Application, json, NextFunction, Request, Response, urlencoded } from 'express';
import { Server as HttpServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';
import cookieSession from 'cookie-session';
import HTTP_STATUS from 'http-status-codes';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import 'express-async-errors';
import bunyan from 'bunyan';
import { config } from '@root/config';
import applicationRoutes from '@root/routes';
import { CustomError, IErrorResponse } from '@global/helerps/error-handler';

const logger: bunyan = config.createLogger('setupServer');
export class ChattyServer {
  private readonly corsObj: { origin: string; methods: string[] } = {
    origin: config.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  };
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
        keys: [config.SECRET_KEY_ONE, config.SECRET_KEY_TWO],
        maxAge: 365 * 24 * 60 * 60 * 1000, // 365 days
        secure: config.NODE_ENV === 'production',
      }),
    );
    app.use(helmet());
    app.use(hpp());
    app.use(
      cors({
        ...this.corsObj,
        credentials: true,
        optionsSuccessStatus: HTTP_STATUS.OK,
      }),
    );
  }

  private standardMiddlewares(app: Application): void {
    app.use(compression());
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));
  }

  private routeMiddlewares(app: Application): void {
    applicationRoutes(app);
  }

  private globalErrorHandler(app: Application): void {
    app.all('*', (req: Request, res: Response) => {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server!`,
      });
    });

    app.use((err: IErrorResponse, req: Request, res: Response, next: NextFunction) => {
      logger.error(err);
      if (err instanceof CustomError) {
        return res.status(err.statusCode).json(err.serializeErrors());
      }
      next();
    });
  }

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: HttpServer = new HttpServer(app);
      const socketIO: Server = await this.createSocketIO(httpServer);
      this.startHttpServer(httpServer);
    } catch (e) {
      logger.error(e);
    }
  }

  private async createSocketIO(httpServer: HttpServer): Promise<Server> {
    const io: Server = new Server(httpServer, {
      cors: this.corsObj,
    });
    const pubClient = createClient({ url: config.REDIS_HOST });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    return io;
  }

  private startHttpServer(httpServer: HttpServer): void {
    logger.info(`Server has started with process id ${process.pid}`);
    httpServer.listen(config.SERVER_PORT, () => {
      logger.info(`Server is running on port ${config.SERVER_PORT}`);
    });
  }

  private socketIOConnections(socketIO: Server): void {
    logger.info(`SocketIO connected`);
  }
}
