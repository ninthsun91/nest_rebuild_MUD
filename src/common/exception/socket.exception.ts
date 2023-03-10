import { ArgumentsHost, BadRequestException, Catch, HttpException, Logger, NotFoundException } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { SocketInputDto } from '../dto';

@Catch()
export class SocketExceptionFilter extends BaseWsExceptionFilter {
  private readonly commendError = 
  `입력이 올바르지 않습니다.
  커맨드 도움말이 필요하다면 [도]움말 혹은 [H]elp를 입력하세요.\n`

  private readonly serverError =
  `알 수 없는 서버 장애가 발생했습니다.
  다시 시도하거나 재접속을 해주세요.\n`

  private readonly notFoundError =
  `Unable to load contents.`

  private logger: Logger;

  constructor() {
    super();
    this.logger = new Logger('SocketException');
  }

  catch(exception: unknown, host: ArgumentsHost) {
    this.errorLogger(exception, host)
    if (exception instanceof WsException) {
      super.catch(exception, host);
    }
    else if (exception instanceof HttpException) {
      const socketException = this.convertHttpException(exception);
      super.catch(socketException, host);
    }
    else {
      const socketException = this.convertUncaughtException(exception);
      super.catch(socketException, host);
    }
  }

  private convertHttpException(exception: HttpException): WsException {
    const script = exception instanceof BadRequestException 
      ? this.commendError 
      : exception instanceof NotFoundException
      ? this.notFoundError
      : this.serverError;
    
    return new WsException({
      field: undefined,
      script,
    });
  }

  private convertUncaughtException(exception: unknown): WsException {
    if (!(exception instanceof Error)) {
      this.logger.error('!!Unknown Exception!!', exception);
      return new WsException({
        field: undefined,
        script: this.serverError
      });
    }
    
    this.logger.error(`!!Uncaught Exception!! ${exception.name}: ${exception.message}`);
    this.logger.error(exception.stack);
    return new WsException({
      field: undefined,
      script: this.serverError
    });
  }

  private errorLogger(exception: unknown, host: ArgumentsHost) {
    const ctx: SocketInputDto = host.switchToWs().getData();
    const userInfo = JSON.stringify(ctx.userInfo);
    
    const message = exception instanceof Error
      ? `error: ${exception.message}, user: ${userInfo}`
      : `unknown error, user: ${userInfo}`;
    this.logger.error(message);
  }

  // const response = exception.getResponse();
  // this.isBadRequest(response, exception.name)
  private isBadRequest(response: string|object, name: string): response is httpExceptionResponse {
    return 'BadRequestException' === name
  }
}

interface httpExceptionResponse { statusCode: number; message: string[], error: string }