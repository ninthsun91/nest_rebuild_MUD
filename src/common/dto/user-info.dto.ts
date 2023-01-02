import { IsAlphanumeric, IsNumber } from 'class-validator';

export class UserInfoDto {

    @IsNumber()
    readonly userId: number;

    @IsAlphanumeric()
    readonly username: string;

    @IsNumber()
    readonly characterId: number;
    
    constructor(data?: any) {
        this.userId = data?.userId || NaN;
        this.username = data?.username || '';
        this.characterId = data?.characterId || NaN;
    }

    static isUserInfo(data: any): data is UserInfoDto {
        for (const key of Object.keys(data)) {
            if (!Object.keys(this.getInstance()).includes(key)) return false;
            if (typeof data[key] !== typeof this.getInstance()[key]) return false;
        }
        return true
    }

    static getInstance() {
        return new UserInfoDto();
    }
}