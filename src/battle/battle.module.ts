import { Module } from '@nestjs/common';
import { BattleGateway } from './battle.gateway';
import { BattleRepository } from './battle.repository';
import { AutoService, DungeonService } from './service';

@Module({
  providers: [
    BattleGateway,
    AutoService, DungeonService,
    BattleRepository,
  ]
})
export class BattleModule {}
