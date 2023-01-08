import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma';
import { BattleRepository } from '../battle.repository';
import { DungeonService } from './dungeon.service';

describe('BattleService', () => {
  let service: DungeonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DungeonService, PrismaService],
    }).useMocker((token) => {
      if (token === BattleRepository) {
        return mockBattleRepo
      }
    }).compile();

    service = module.get<DungeonService>(DungeonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('dungeonHelp()', () => {
    it.todo('[SUCCESS] should return help script');
  });

  describe('dungeonList()', () => {
    it.todo('[SUCCESS] should return dungeon list script');
  });

  describe('dungeonInfo()', () => {
    it.todo('[SUCCESS] should return dungeon info script');
  });

  describe('startAutoBattle()', () => {
    it.todo('[FAIL] should throw WsException when invalid userStatus');
    it.todo('[SUCCESS] should return warning script when hp below 30%');
    it.todo('[SUCCESS] should return battle script');
  });
});

const mockBattleRepo = {}