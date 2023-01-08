import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';

@Injectable()
export class BattleRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createMonster() {}

  async destroyMonster() {}

  async updateCharacterStatus() {}

  async levelCheckCharacter() {}
}