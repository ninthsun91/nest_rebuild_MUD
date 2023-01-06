import { Test, TestingModule } from '@nestjs/testing';
import { WsException } from '@nestjs/websockets';
import { SocketResponseDto, UserInfoDto } from 'src/common/dto';
import { SignService } from './sign.service';
import { PrismaService } from 'src/prisma';
import { LoginRepository } from '../login.repository';


describe('LoginService', () => {
  let service: SignService;
  const mockLoginRepo = {
    findUser: jest.fn(({ username }) => {
      if (username === 'test') return 'user';
      return null;
    }),
    verifyUser: jest.fn(({ username, password }) => {
      if (username === 'test01' && password === 'qwe123') {
        return {
          userId: 1,
          username,
          characterId: 1
        }
      };
      if (username === 'test02' && password === 'qwe123') {
        return {
          userId: 1,
          username,
          characterId: -1
        }
      }
      return null;
    }),
    createUser: jest.fn((data) => {
      return {
        userId: 1,
        username: data?.username,
        characterId: -1
      }
    }),
    createCharacter: jest.fn((userId: number, name: string) => {
      return {
        characterId: 1,
        userId,
        name
      }
    }),
    findCharacter: jest.fn((userId: number) => {
      if (userId < 1) return null;
      return {
        characterId: 1,
        userId: 1,
        name: 'testcharacter01',
      }
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SignService, PrismaService],
    }).useMocker((token) => {
      if (token === LoginRepository) {
        return mockLoginRepo;
      }
    }).compile();

    service = module.get<SignService>(SignService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signupPassword()', () => {
    it('FAIL: should throw WsException when wrong username format', async() => {
      const CMD = '';
      const userInfo = {};

      service.signupPassword(CMD, userInfo as UserInfoDto).catch((error: unknown) => {
        expect(error).toBeInstanceOf(WsException);
      });
    });

    it('FAIL: should throw WsException when username duplication', async() => {
      const CMD = 'test';
      const userInfo = {};

      service.signupPassword(CMD, userInfo as UserInfoDto).catch((error: unknown) => {
        expect(error).toBeInstanceOf(WsException);
      });
    });
    it('SUCCESS: should return field "sign:11" and userInfo with username', async() => {
      const CMD = 'test01';
      const userInfo = {};

      const response: Partial<SocketResponseDto> = await service.signupPassword(CMD, userInfo as UserInfoDto);
      expect(response.field).toBe('sign:11');
      expect(response.userInfo?.username).toEqual(CMD);
    });
  });

  describe('createUser()', () => {
    it('FAIL: should throw WsException when wrong password format', async() => {
      const CMD = '1234';
      const userInfo = {
        userId: -1,
        username: 'test01',
        characterId: -1
      }

      service.createUser(CMD, userInfo as UserInfoDto).catch((error: unknown) => {
        expect(error).toBeInstanceOf(WsException);
      });
    });

    it('SUCCESS: should return field "sign:12" and userInfo with userId', async() => {
      const CMD = 'qwe123';
      const userInfo = {
        userId: -1,
        username: 'test01',
        characterId: -1
      }

      const response = await service.createUser(CMD, userInfo as UserInfoDto);

      expect(response.field).toBe('sign:12');
      expect(response.userInfo?.userId).toBeGreaterThan(0);
    });
  });

  describe('createCharacter()', () => {
    it('FAIL: should throw WsException when wrong name format', async() => {
      const CMD = '1234';
      const userInfo = {
        userId: 1,
        username: 'test01',
        characterId: -1
      }

      service.createCharacter(CMD, userInfo as UserInfoDto).catch((error: unknown) => {
        expect(error).toBeInstanceOf(WsException);
      });
    });

    it('SUCCESS: should return field "front" and userStatus', async() => {
      const CMD = 'testcharacter01';
      const userInfo = {
        userId: 1,
        username: 'test01',
        characterId: -1
      }

      const response = await service.createCharacter(CMD, userInfo as UserInfoDto);

      expect(response.field).toBe('front');
      expect(response?.userInfo?.characterId).toBeGreaterThan(0);
      expect(response?.userStatus).toBeDefined();
    });
  });

  describe('signinPassword()', () => {
    it('FAIL: should throw WsException when empty username', async() => {
      const CMD = '';
      const userInfo = {};

      service.signinPassword(CMD, userInfo as UserInfoDto).catch((error: unknown) => {
        expect(error).toBeInstanceOf(WsException);
      });
    });

    it('SUCCESS: should return field "sign:21" and userInfo with username', async() => {
      const CMD = 'test01';
      const userInfo = {};

      const response = await service.signinPassword(CMD, userInfo as UserInfoDto);

      expect(response.field).toBe('sign:21');
      expect(response?.userInfo?.username).toEqual(CMD);
    });
  });

  describe('signinVerify()', () => {
    it('FAIL: should throw WsException when empty password', () => {
      const CMD = '';
      const userInfo = {
        userId: -1,
        username: 'test01',
        characterId: -1
      }

      service.signinVerify(CMD, userInfo as UserInfoDto).catch((error: unknown) => {
        expect(error).toBeInstanceOf(WsException);
      });
    });

    it('FAIL: should throw WsException when user not found', () => {
      const CMD = 'qwe124';
      const userInfo = {
        userId: -1,
        username: 'test01',
        characterId: -1
      }

      service.signinVerify(CMD, userInfo as UserInfoDto).catch((error: unknown) => {
        expect(error).toBeInstanceOf(WsException);
      });
    });

    it('FAIL: should throw WsException when character not found', () => {
      const CMD = 'qwe123';
      const userInfo = {
        userId: -1,
        username: 'test02',
        characterId: -1
      }

      service.signinVerify(CMD, userInfo as UserInfoDto).catch((error: unknown) => {
        expect(error).toBeInstanceOf(WsException);
      });
    });

    it('SUCCESS: should return field "front" and userStatus', async() => {
      const CMD = 'qwe123';
      const userInfo = {
        userId: -1,
        username: 'test01',
        characterId: -1
      }

      const response = await service.signinVerify(CMD, userInfo as UserInfoDto);

      expect(response.field).toBe('front');
      expect(response?.userInfo?.characterId).toBeGreaterThan(0);
      expect(response?.userStatus).toBeDefined();
    });
  });
});
