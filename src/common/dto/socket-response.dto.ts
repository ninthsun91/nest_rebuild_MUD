import { UserInfoDto } from './user-info.dto';
import { UserStatusDto } from './user-status.dto';

export class SocketResponseDto {

    readonly field: string;

    readonly script: string;

    readonly userInfo?: UserInfoDto;

    readonly userStatus?: UserStatusDto;
}