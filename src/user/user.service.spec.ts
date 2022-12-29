import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { prismaMock } from '../prisma/singleton';
import { PrismaService } from '../prisma/prisma.service';
import { HttpException } from '@nestjs/common/exceptions';

describe('UserService', () => {
  const createdAt = new Date();
  const updatedAt = createdAt;
  const user = {
    id: 99,
    username: 'test',
    password: '1234',
    createdAt, updatedAt,
  }
  prismaMock.user.create.mockResolvedValue(user)

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

  it('should create a new user', async() => {
    await expect(service.createUser(user)).resolves.toEqual(user);
  });

  it('should return the exact user', async() => {
    const where = { username: user.username };
    await expect(service.user(where)).resolves.toEqual(user);
  });

  it('FAIL: should return null', async() => {
    const where = { username: 'wrongUser' };
    await expect(service.user(where)).resolves.toEqual(null);
  });

  it('should return user list', async() => {
    const users = await service.users({});
    expect(users).toBeInstanceOf(Object);
  });

  it('FAIL: should throw HttpException', async() => {
    const where = { id: 999 };
    const data = { username: 'testeddd' };

    expect(service.updateUser({ where, data })).rejects.toBeInstanceOf(HttpException);
  });

  it('username should have been changed', async() => {
    const where = { id: user.id };
    const data = { username: 'tested' };

    const result = await service.updateUser({ where, data });
    user.username = result.username;

    expect(result.username).toEqual('tested');
  });

  it('FAIL: should throw HttpException', async() => {
    const where = { id: 999 };

    expect(service.deleteUser(where)).rejects.toBeInstanceOf(HttpException);
  });

  it('should return a user', async() => {
    const where =  { username: user.username };
    
    const result = await service.deleteUser(where);
    expect(result.username).toEqual('tested');
  });
});
