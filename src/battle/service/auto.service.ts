import { BadRequestException, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { SocketInputDto, SocketResponseDto, UserInfoDto, UserStatusDto } from 'src/common/dto';
import { BattleRepository } from '../battle.repository';

@Injectable()
export class AutoService {
  constructor(private readonly battleRepo: BattleRepository) {}

  handler(client: Socket, payload: SocketInputDto): void {
    const { line, userInfo, userStatus } = payload;
    const [ CMD1, CMD2 ] = line.trim().toUpperCase().split(' ');

    const cmdRoute = {
      'HELP': 'battleHelp',
      'QUIT': 'quitAutoBattle'
    }
    if (!Object.hasOwn(cmdRoute, CMD1)) {
      throw new BadRequestException();
    }

    return this[cmdRoute[CMD1]](CMD2, userInfo, userStatus)
      .then((data: SocketResponseDto) => {
        client.emit('print', data);
      });
  }

  async battleHelp(
    CMD: string|undefined,
    userInfo: UserInfoDto,
    userStatus: UserStatusDto
  ): Promise<SocketResponseDto> {
    return {
      field: '',
      script: ''
    }
  }

  async quitAutoBattle(
    CMD: string|undefined,
    userInfo: UserInfoDto,
    userStatus: UserStatusDto
  ): Promise<SocketResponseDto> {
    return {
      field: '',
      script: ''
    }
  }
}
