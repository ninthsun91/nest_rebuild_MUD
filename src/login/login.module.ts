import { Module } from '@nestjs/common';
import { LoginGateway } from './login.gateway';
import { FrontService, NoneService, SignService } from './service';

@Module({
  providers: [
    LoginGateway,
    NoneService,
    FrontService,
    SignService
  ]
})
export class LoginModule {}
