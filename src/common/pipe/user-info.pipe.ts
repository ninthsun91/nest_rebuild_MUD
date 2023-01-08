import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UserInfoDto } from '../dto';


@Injectable()
export class UserInfoPipe implements PipeTransform<any> {

    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || this.toValidate(metatype) || value.id) {
            return value;
        }

        const object = plainToInstance(metatype, value);
        const socketInputResult = await validate(object);
        const userInfoResult = object?.userInfo ?
            UserInfoDto.isUserInfo(object?.userInfo) : true;

        if (socketInputResult.length > 0 || !userInfoResult) {
            throw new BadRequestException('UserInfoPipe validation failed');
        }

        return value;
    }

    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return types.includes(metatype);
    }
}