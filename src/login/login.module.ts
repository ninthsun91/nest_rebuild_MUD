import { Module } from '@nestjs/common';
import { LoginGateway } from './login.gateway';
import { LoginRepository } from './login.repository';
import { FrontService, NoneService, SignService } from './service';

@Module({
  providers: [
    LoginRepository,
    LoginGateway,
    NoneService,
    FrontService,
    SignService,
  ]
})
export class LoginModule {}
