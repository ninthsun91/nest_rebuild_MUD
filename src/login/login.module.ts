import { Module } from '@nestjs/common';
import { LoginGateway } from './login.gateway';
import { LoginService } from './login.service';

@Module({
  providers: [LoginGateway, LoginService]
})
export class LoginModule {}
