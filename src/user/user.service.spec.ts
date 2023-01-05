import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma';
import { UserService } from '../user';
import { HttpException } from '@nestjs/common/exceptions';
import { prismaMock } from '../prisma/singleton';

describe('UserService', () => {
  const createdAt = new Date();
  const updatedAt = createdAt;
  const user = {
    id: 99,
    username: 'test',
    password: '1234',
    createdAt,
    updatedAt,
  };

  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  
  describe('createUser()', () => {
    it('FAIL: should throw HttpException', async () => {
      const fakeUser = {
        username: 'root',
        password: 'qwe123',
      }

      expect(service.createUser(fakeUser)).rejects.toBeInstanceOf(HttpException);
    });

    it('should increase user list length', async () => {
      prismaMock.user.create.mockResolvedValue(user);

      const userBefore = await service.users({});  
      await service.createUser(user);
      const userAfter = await service.users({});

      expect(userAfter.length).toEqual(userBefore.length + 1);
    });
  });

  describe('user()', () => {
    prismaMock.user.findUnique.mockResolvedValue(user).mockRejectedValue(null);
    
    it('FAIL: should return null', async () => {
      const where = { username: 'wrongUser' };
      await expect(service.user(where)).resolves.toEqual(null);
    });
    
    it('should return username "test"', async () => {
      const where = { id: user.id };

      const result = await service.user(where);
      
      expect(result?.username).toEqual(user.username);
    });
  });

  describe('users()', () => {
    
    it('should return user list', async () => {
      prismaMock.user.findMany.mockResolvedValue([user]);
      // await expect(service.users({})).resolves.toEqual([user]);
      const users = await service.users({});
      expect(users).toBeInstanceOf(Array);
    });
  });

  describe('updateUser()', () => {
    prismaMock.user.update.mockResolvedValue(user);

    it('FAIL: should throw HttpException', async () => {
      const where = { id: 999 };
      const data = { username: 'testeddd' };
  
      expect(service.updateUser({ where, data })).rejects.toBeInstanceOf(
        HttpException,
      );
    });
  
    it('should change username', async () => {
      const where = { id: user.id };
      const data = { username: 'tested' };
  
      const result = await service.updateUser({ where, data });
      user.username = result.username;
  
      expect(result.username).toEqual('tested');
    });
  });

  describe('deleteUser()', () => {
    prismaMock.user.delete.mockResolvedValue(user);

    it('FAIL: should throw HttpException', async () => {
      const where = { id: 999 };
  
      expect(service.deleteUser(where)).rejects.toBeInstanceOf(HttpException);
    });
  
    it('should decrease user list length', async () => {
      const where = { username: user.username };

      const userBefore = await service.users({});  
      await service.deleteUser(where);
      const userAfter = await service.users({});

      expect(userAfter.length).toEqual(userBefore.length - 1);
    });
  });

});
