import { Body, Controller, Get, Post, Delete, HttpException, HttpStatus, Param, Patch } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto, FindUserDto } from './dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Get()
    async findAllUsers(): Promise<User[]> {
      return this.userService.users({});
    }

    @Get('/:id')
    async findUser(
      @Param('id') id: string
    ): Promise<User> {
      const user = await this.userService.user({ id: +id });
      if (!user) throw new HttpException(
          'USER NOT FOUND', HttpStatus.BAD_REQUEST
      );

      return user;
    }
  
    @Post()
    async createUser(
      @Body() userData: CreateUserDto
    ): Promise<void> {
      const user = this.userService.createUser(userData);
      if (!user) throw new HttpException(
          'USER CREATION ERROR', HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    @Patch('/:id')
    async updateUser(
      @Body() data: UpdateUserDto,
      @Param('id') id: string
    ): Promise<void> {
      const where = { id: +id };
      await this.userService.updateUser({ where, data });

    }

    @Delete()
    async deleteUser(
      @Body() username: Pick<CreateUserDto, 'username'>
    ): Promise<void> {
      await this.userService.deleteUser(username);
    }
}
