import { IsOptional, IsString } from 'class-validator';
import { UserInfoDto } from './user-info.dto';
import { UserStatusDto } from './user-status.dto';

export class SocketInputDto {
    @IsString()
    readonly line: string;

    @IsOptional()
    readonly userInfo: UserInfoDto;

    @IsOptional()
    readonly userStatus: UserStatusDto;

    @IsOptional()
    readonly option: string;
}