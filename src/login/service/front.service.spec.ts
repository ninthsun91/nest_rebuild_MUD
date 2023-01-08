import { Test, TestingModule } from '@nestjs/testing';
import { Socket } from 'socket.io';
import { SocketResponseDto, UserInfoDto } from 'src/common/dto';
import { FrontService } from './front.service';

describe('LoginService', () => {
  let service: FrontService;
  let client: Socket;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FrontService],
    }).compile();

    service = module.get<FrontService>(FrontService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('socket response test', () => {
    it('should return field "sign:20"', () => {
      const CMD = '';
      const userInfo = {};
  
      const response: Partial<SocketResponseDto> = service.signin(CMD, userInfo as UserInfoDto);
      
      expect(response.field).toBe('sign:20');
    });

    it('should return field "sign:10"', () => {
      const CMD = '';
      const userInfo = {};
  
      const response: Partial<SocketResponseDto> = service.signup(CMD, userInfo as UserInfoDto);
      
      expect(response.field).toBe('sign:10');
    });

    it('should return field "none"', () => {
      const CMD = '';
      const userInfo = {};
  
      const response: Partial<SocketResponseDto> = service.signout(CMD, userInfo as UserInfoDto);
      
      expect(response.field).toBe('none');
    });

    it('should return field "dungeon"', () => {
      const CMD = '';
      const userInfo = {};
  
      const response: Partial<SocketResponseDto> = service.toDungeon(CMD, userInfo as UserInfoDto);
      
      expect(response.field).toBe('dungeon');
    });

    it('should return field "village"', () => {
      const CMD = '';
      const userInfo = {};
  
      const response: Partial<SocketResponseDto> = service.toVillage(CMD, userInfo as UserInfoDto);
      
      expect(response.field).toBe('village');
    });

    it('should return field "none"', () => {
      const CMD = '';
      const userInfo = {};
  
      const response: Partial<SocketResponseDto> = service.deleteAccount(CMD, userInfo as UserInfoDto);
      
      expect(response.field).toBe('none');
    });
  });
});
