import HTTP_STATUS from 'http-status-codes';

export interface IError {
  message: string;
  statusCode: number;
  status: string;
}

export interface IErrorResponse extends IError {
  serializeErrors(): IError;
}

export class CustomError extends Error implements IErrorResponse {
  constructor(
    public statusCode: number,
    public status: string,
    public message: string,
  ) {
    super(message);
  }
  serializeErrors(): IError {
    return {
      message: this.message,
      statusCode: this.statusCode,
      status: this.status,
    };
  }
}

export class JoiRequestValidationError extends CustomError {
  constructor(message: string) {
    super(HTTP_STATUS.BAD_REQUEST, 'Bad Request', message);
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string) {
    super(HTTP_STATUS.BAD_REQUEST, 'Bad Request', message);
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string) {
    super(HTTP_STATUS.NOT_FOUND, 'Not Found', message);
  }
}

export class InternalServerError extends CustomError {
  constructor(message: string) {
    super(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Internal Server Error', message);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string) {
    super(HTTP_STATUS.UNAUTHORIZED, 'Unauthorized', message);
  }
}

export class FileTooLargeError extends CustomError {
  constructor(message: string) {
    super(HTTP_STATUS.REQUEST_TOO_LONG, 'File Too Large', message);
  }
}
