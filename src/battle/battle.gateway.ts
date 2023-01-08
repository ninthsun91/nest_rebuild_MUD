import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketInputDto } from 'src/common/dto';
import { AutoService, DungeonService } from './service';

@WebSocketGateway({ 
  namespace: 'battle', 
  cors: 'http://localhost:8080'
})
export class BattleGateway implements OnGatewayInit, OnGatewayConnection {

  private readonly logger = new Logger(BattleGateway.name);

  constructor(
    private readonly BattleService: AutoService,
    private readonly DungeonService: DungeonService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('BattleGateway Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    const message = `${client.id} connected`;
    this.logger.log(message);
    client.emit('log', { message });
  }

  @SubscribeMessage('dungeon')
  dungeonHandler(client: Socket, payload: SocketInputDto): void {
    const message = `/battle/dungeon, line: ${payload.line}, user: ${JSON.stringify(payload.userInfo)}`;
    this.logger.log(message);

    return this.DungeonService.handler(client, payload);
  }

  @SubscribeMessage('auto')
  autoHandler(client: Socket, payload: SocketInputDto): void {
    const message = `/battle/auto, line: ${payload.line}, user: ${JSON.stringify(payload.userInfo)}`;
    this.logger.log(message);

    return this.DungeonService.handler(client, payload);
  }
}