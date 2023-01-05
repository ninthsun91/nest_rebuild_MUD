import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma';
import { UserController, UserService } from '../user';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const createdAt = new Date();
  const updatedAt = createdAt;
  const user = {
    userId: 99,
    username: 'test',
    password: '1234',
    createdAt,
    updatedAt,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, PrismaService],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser()', () => {
    it('should throw HttpException', async() => {
      jest.spyOn(service, 'createUser').mockImplementation(async(userData) => {
        if (userData.username === 'root') {
          throw new HttpException('DUP', 400);
        }
        return user;
      });
      const wrongUser = {
        username: 'root',
        password: 'qwe123'
      }

      expect(controller.createUser(wrongUser)).rejects.toBeInstanceOf(HttpException);
    });

    it('should return void', async() => {
      jest.spyOn(service, 'createUser').mockImplementation(async() => user);
      expect(await controller.createUser(user)).toBeFalsy();
    });
  });

  describe('findUser()', () => {
    it('FAIL: should throw HttpException', async() => {
      jest.spyOn(service, 'user').mockImplementation(async(where) => {
        return where.userId !== 99 ? null : user;
      });

      expect(controller.findUser(999)).rejects.toBeInstanceOf(HttpException);
    });

    it('should return user', async() => {
      jest.spyOn(service, 'user').mockImplementation(async() => user);

      expect(controller.findUser(user.userId)).resolves.toEqual(user);
    });
  });

  describe('findAllUsers()', () => {
    it('should return user list', async() => {
      jest.spyOn(service, 'users').mockImplementation(async() => [user]);

      expect(controller.findAllUsers()).resolves.toBeInstanceOf(Array);
    });
  });

  describe('updateUser()', () => {
    it('should return void', async() => {
      jest.spyOn(service, 'updateUser').mockImplementation(async() => user);
      const data = { username: 'updated' };

      expect(controller.updateUser(data, user.userId)).resolves.toBeFalsy();
    });
  });

  describe('deleteUser()', () => {
    it('should return void', async() => {
      jest.spyOn(service, 'deleteUser').mockImplementation(async() => user);
      const data = { username: user.username };

      expect(controller.deleteUser(data)).resolves.toBeFalsy();
    });
  });
});
