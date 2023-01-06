import { BadRequestException, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { SocketInputDto, SocketResponseDto } from 'src/common/dto';
import { UserInfoDto } from 'src/common/dto/user-info.dto';
import { CommendRouter } from 'src/common/interface';
import { fieldScript, homeScript, signScript } from 'src/common/script';

@Injectable()
export class FrontService {
    handler(client: Socket, payload: SocketInputDto): void {
        const { line, userInfo } = payload;

        const [CMD1, CMD2] = line.trim().toUpperCase().split(' ');

        const cmdRoute: CommendRouter = {
            'IN': this.signin,
            'UP': this.signup,
            'OUT': this.signout,
            'DUNGEON': this.toDungeon,
            'VILLAGE': this.toVillage,
            'DELETE': this.deleteAccount,
        }
        if (!Object.hasOwn(cmdRoute, CMD1)) {
            throw new BadRequestException();
        }

        const data = cmdRoute[CMD1](CMD2, userInfo);
        client.emit('print', data);
        return;
    }

    signin(CMD: string|undefined, userInfo: UserInfoDto): Partial<SocketResponseDto> {
        return {
            field: 'sign:20',
            script: signScript.in + signScript.username,
            userInfo,
        }
    }

    signup(CMD: string|undefined, userInfo: UserInfoDto): Partial<SocketResponseDto> {
        return {
            field: 'sign:10',
            script: signScript.up + signScript.username,
            userInfo,
        }
    }

    signout(CMD: string|undefined, userInfo: UserInfoDto): Partial<SocketResponseDto> {
        return {
            field: 'none',
            script: homeScript.signout,
        }
    }

    toDungeon(CMD: string|undefined, userInfo: UserInfoDto): Partial<SocketResponseDto> {
        return {
            field: 'dungeon',
            script: fieldScript.dungeon,
            userInfo,
        }
    }

    toVillage(CMD: string|undefined, userInfo: UserInfoDto): Partial<SocketResponseDto> {
        return {
            field: 'village',
            script: fieldScript.village,
            userInfo,
        }
    }

    deleteAccount(CMD: string|undefined, userInfo: UserInfoDto): Partial<SocketResponseDto> {
        return {
            field: 'none',
            script: homeScript.delete,
        }
    }
}
