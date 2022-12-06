import { Module } from '@nestjs/common';
import { ApiAuthResolver } from './api-auth.resolver';
import { ApiAuthService } from './api-auth.service';

@Module({
  controllers: [],
  providers: [ApiAuthService, ApiAuthResolver],
  exports: [ApiAuthService],
})
export class ApiAuthModule {}
