import { IsAlphanumeric, IsNumber } from 'class-validator';

export class UserInfoDto {
    @IsNumber()
    readonly userId: number;

    @IsAlphanumeric()
    readonly username: string;

    @IsNumber()
    readonly characterId: number;
}