import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { LoginModule } from './login/login.module';
import { BattleModule } from './battle/battle.module';

@Module({
  imports: [UserModule, PrismaModule, LoginModule, BattleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
