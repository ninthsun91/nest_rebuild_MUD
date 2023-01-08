import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma';
import { BattleRepository } from '../battle.repository';
import { AutoService } from './auto.service';

describe('BattleService', () => {
  let service: AutoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AutoService, PrismaService],
    }).useMocker((token) => {
      if (token === BattleRepository) {
        return mockBattleRepo
      }
    }).compile();

    service = module.get<AutoService>(AutoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('battleHelp()', () => {
    it.todo('[SUCCESS] should return battle help script');
  });

  describe('quitAutoBattle()', () => {
    it.todo('[SUCCESS] should return to dungeon entrance');
  });
});

const mockBattleRepo = {}