import { Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketInputDto, SocketResponseDto } from '../common/dto';
import { FrontService, NoneService, SignService } from './service';

@UsePipes(new ValidationPipe())
@WebSocketGateway({ 
  namespace: 'login', 
  cors: ['http://localhost:8080', '*']})
export class LoginGateway implements OnGatewayInit, OnGatewayConnection {
  private readonly logger = new Logger(LoginGateway.name);
  constructor(
    private readonly frontService: FrontService,
    private readonly noneService: NoneService,
    private readonly signService: SignService
  ) {}

  afterInit(server: Server) {
    this.logger.log('LoginGateway Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    const message = `${client.id} connected`;
    this.logger.log(message);
    client.emit('log', { message });
  }

  @SubscribeMessage('none')
  noneHandler(
    client: Socket, 
    payload: SocketInputDto
  ): Pick<SocketResponseDto, 'field'|'script'> {
    const message = `/login/none, from: ${client.id}`;
    this.logger.log(message);

    return this.noneService.loadFront(payload);
  }

  @SubscribeMessage('front')
  frontHandler(client: Socket, payload: SocketInputDto): void {
    const message = `/login/front, line: ${payload.line}, user: ${payload.userInfo}`;
    this.logger.log(message);

    this.frontService.handler(client, payload);
  }

  @SubscribeMessage('sign')
  signHandler(client: Socket, payload: SocketInputDto): void {
    client.emit('message', { message: 'FROM LOGIN SIGNHANDLER' });
  }
}
