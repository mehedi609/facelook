import dotenv from 'dotenv';
import bunyan from 'bunyan';

dotenv.config();

class Config {
  private readonly DEFAULT_DATABASE_URL: string =
    'mongodb://0.0.0.0:27017/chattyDB';

  private readonly _DATABASE_URL: string =
    (process.env.DATABASE_LOCAL_URI as string) || this.DEFAULT_DATABASE_URL;
  private readonly _DATABASE: string = (process.env.DATABASE as string) || '';
  private readonly _JWT_TOKEN: string =
    (process.env.JWT_TOKEN as string) || '1234';
  private readonly _NODE_ENV: string = (process.env.NODE_ENV as string) || '';
  private readonly _SECRET_KEY_ONE: string =
    (process.env.SECRET_KEY_ONE as string) || '';
  private readonly _SECRET_KEY_TWO: string =
    (process.env.SECRET_KEY_TWO as string) || '';
  private readonly _CLIENT_URL: string =
    (process.env.CLIENT_LOCAL_URL as string) || '';
  private readonly _SERVER_PORT: number = Number(process.env.PORT) || 5000;
  private readonly _REDIS_HOST: string =
    (process.env.REDIS_HOST as string) || '';

  public get DATABASE_URL(): string {
    return `${this._DATABASE_URL}/${this._DATABASE}`;
  }

  public get JWT_TOKEN(): string {
    return this._JWT_TOKEN;
  }

  public get NODE_ENV(): string {
    return this._NODE_ENV;
  }

  public get SECRET_KEY_ONE(): string {
    return this._SECRET_KEY_ONE;
  }

  public get SECRET_KEY_TWO(): string {
    return this._SECRET_KEY_TWO;
  }

  public get CLIENT_URL(): string {
    return this._CLIENT_URL;
  }

  public get SERVER_PORT(): number {
    return this._SERVER_PORT;
  }

  public get REDIS_HOST(): string {
    return this._REDIS_HOST;
  }

  public validateConfig(): void {
    for (const [key, value] of Object.entries(this)) {
      if (value === undefined) {
        throw new Error(`Missing configuration for ${key}`);
      }
    }
  }

  public createLogger(name: string): bunyan {
    return bunyan.createLogger({ name, level: 'debug' });
  }
}

export const config: Config = new Config();
