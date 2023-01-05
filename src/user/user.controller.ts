import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  Patch,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAllUsers(): Promise<User[]> {
    return this.userService.users({});
  }

  @Get('/:id')
  async findUser(@Param('id') userId: number): Promise<User> {
    const where = { userId };
    const user = await this.userService.user(where);
    if (!user) throw new HttpException(
      'USER NOT FOUND', HttpStatus.BAD_REQUEST
    );

    return user;
  }

  @Post()
  async createUser(@Body() userData: CreateUserDto): Promise<void> {
    await this.userService.createUser(userData);
  }

  @Patch('/:id')
  async updateUser(
    @Body() data: UpdateUserDto,
    @Param('id') userId: number,
  ): Promise<void> {
    const where = { userId };
    await this.userService.updateUser({ where, data });
  }

  @Delete()
  async deleteUser(
    @Body() username: Pick<CreateUserDto, 'username'>,
  ): Promise<void> {
    await this.userService.deleteUser(username);
  }
}
