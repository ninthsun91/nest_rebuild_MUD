import { PartialType, PickType } from '@nestjs/mapped-types';
import { UserDto } from './user.dto';

export class FindUserDto extends PartialType(
  PickType(UserDto, ['id', 'username'] as const)
) {}
