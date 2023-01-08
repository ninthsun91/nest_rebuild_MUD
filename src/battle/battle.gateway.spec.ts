import { Test, TestingModule } from '@nestjs/testing';
import { BattleGateway } from './battle.gateway';
import { AutoService, DungeonService } from './service';

describe('BattleGateway', () => {
  let gateway: BattleGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BattleGateway],
    }).useMocker((token) => {
      if (token === DungeonService) {
        return mockDungeonService;
      } else if (token === AutoService) {
        return mockAutoService;
      }
    }).compile();

    gateway = module.get<BattleGateway>(BattleGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('dungeonHandler()', () => {
    it.todo('[FAIL] should return BadRequestExcpetion when wrong commend');
    it.todo('[SUCCESS]: should return void when right commend');
  });
  describe('autoHandler()', () => {
    it.todo('[FAIL] should return BadRequestExcpetion when wrong commend');
    it.todo('[SUCCESS]: should return void when right commend');
  });
});

const mockDungeonService = {}

const mockAutoService = {}