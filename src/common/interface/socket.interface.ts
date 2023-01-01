import { UserDto } from 'src/login/dto/user.dto';
import { SocketResponseDto } from '../dto';
import { UserStatusDto } from '../dto/user-status.dto';

type CommendHandler = {
    (CMD: string, userInfo: Partial<UserDto>): Partial<SocketResponseDto>;
    (CMD: string, userInfo: Partial<UserDto>, option: string): Partial<SocketResponseDto>;
    (CMD: string, userInfo: Partial<UserDto>, userStatus: Partial<UserStatusDto>): Partial<SocketResponseDto>;
}


export interface CommendRouter {
    [key: string]: CommendHandler;
}