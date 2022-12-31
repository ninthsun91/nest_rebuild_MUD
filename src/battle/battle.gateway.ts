import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BattleService } from './battle.service';

@WebSocketGateway({ 
  namespace: 'battle', 
  cors: 'http://localhost:8080'
})
export class BattleGateway implements OnGatewayInit, OnGatewayConnection {
  private readonly logger = new Logger(BattleGateway.name);
  constructor(private readonly BattleService: BattleService) {}

  afterInit(server: Server) {
    this.logger.log('BattleGateway Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    const message = `${client.id} connected`;
    this.logger.log(message);
    client.emit('log', { message });
  }

  @SubscribeMessage('message')
  handleMessage(client: Server, payload: any): string {
    return 'Hello world!';
  }
}
