import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Socket } from 'socket.io';
import { SocketInputDto } from 'src/common/dto';
import { PrismaService } from 'src/prisma';
import { LoginGateway } from './login.gateway';
import { LoginRepository } from './login.repository';
import { FrontService, NoneService, SignService } from './service';

describe('LoginGateway', () => {
  let gateway: LoginGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoginGateway, LoginRepository, PrismaService, NoneService],
    }).useMocker((token) => {
      if (token === FrontService) {
        return mockFrontService;
      }
      if (token === SignService) {
        return mockSignService;
      }
    }).compile();

    gateway = module.get<LoginGateway>(LoginGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('noneHandler()', () => {
    it('FAIL: should return field "none" when wrong line input', () => {
      const client = {};
      const payload = { line: 'wrong' }
      
      const response = gateway.noneHandler(client as Socket, payload as SocketInputDto);
      
      expect(response.field).toEqual('none');
    });

    it('SUCCESS: should return field "front"', () => {
      const client = {};
      const payload = { line: 'load' }
      
      const response = gateway.noneHandler(client as Socket, payload as SocketInputDto);

      expect(response.field).toEqual('front');
    });
  });

  describe('frontHandler()', () => {
    it('FAIL: should return BadRequestExcpetion when wrong commend', () => {
      const client = {};
      const payload = { line: 'wrong' }
      
      try {
        gateway.frontHandler(client as Socket, payload as SocketInputDto);
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('SUCCESS: should return void when right commend', () => {
      const client = {};
      const payload = { line: 'in' }
      
      const response = gateway.frontHandler(client as Socket, payload as SocketInputDto);

      expect(response).toBeUndefined();
    });
  });

  describe('signHandler()', () => {
    it('FAIL: should return BadRequestExcpetion when wrong commend', () => {
      const client = {};
      const payload = { line: 'test01', option: 'option' };
      
      try {
        gateway.signHandler(client as Socket, payload as SocketInputDto);
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('SUCCESS: should return void when right commend', () => {
      const client = {};
      const payload = { line: 'test01', option: '10' };
      
      const response = gateway.signHandler(client as Socket, payload as SocketInputDto);

      expect(response).toBeUndefined();
    });
  });
});


const mockFrontService = {
  handler: jest.fn((client: Socket, payload: SocketInputDto) => {
    const { line } = payload;
    const [CMD1, CMD2] = line.trim().toUpperCase().split(' ');

    const frontCommend = ['IN', 'UP', 'OUT', 'DUNGEON', 'VILLAGE', 'DELETE'];
    if (!frontCommend.includes(CMD1)) {
      throw new BadRequestException();
    }
    return
  })
}

const mockSignService = {
  handler: jest.fn((client: Socket, payload: SocketInputDto) => {
    const { option } = payload;

    const signCommend = ['10', '11', '12', '20', '21'];
    if (!signCommend.includes(option)) {
      throw new BadRequestException();
    }
    return
  })
}