import { IsAlphanumeric, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UserStatusDto {
    @IsNumber()
    @IsNotEmpty()
    readonly characterId: number;

    @IsAlphanumeric()
    @IsNotEmpty()
    readonly username: string;

    @IsAlphanumeric()
    @IsNotEmpty()
    readonly name: string;

    @IsNumber()
    @IsNotEmpty()
    readonly level: number;

    @IsNumber()
    @IsNotEmpty()
    readonly attack: number;

    @IsNumber()
    @IsNotEmpty()
    readonly maxHp: number;

    @IsNumber()
    @IsNotEmpty()
    readonly maxMp: number;

    @IsNumber()
    @IsNotEmpty()
    readonly curHp: number;

    @IsNumber()
    @IsNotEmpty()
    readonly curMp: number;

    @IsNumber()
    @IsNotEmpty()
    readonly exp: number;

    @IsOptional()
    @IsNumber()
    readonly cooldown?: number;

    @IsOptional()
    @IsBoolean()
    readonly levelup?: boolean;

    @IsOptional()
    @IsString()
    readonly isDead?: string;
}