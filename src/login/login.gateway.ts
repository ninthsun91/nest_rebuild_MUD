import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LoginService } from './login.service';

@WebSocketGateway({ 
  namespace: 'login', 
  cors: 'http://localhost:8080'
})
export class LoginGateway implements OnGatewayInit, OnGatewayConnection {
  private readonly logger = new Logger(LoginGateway.name);
  constructor(private readonly loginService: LoginService) {}

  afterInit(server: Server) {
    this.logger.log('LoginGateway Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    const message = `${client.id} connected`;
    this.logger.log(message);
    client.emit('log', { message });
  }

  @SubscribeMessage('test')
  handleMessage(client: Server, payload: any): string {
    console.log('from client: ', payload);
    client.emit('message', { message: 'FROM LOGINGATEWAY' });
    return 'FROM LOGINGATEWAY';
  }
}
