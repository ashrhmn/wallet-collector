import { Module } from '@nestjs/common';
import { ApiAddressResolver } from './api-address.resolver';
import { ApiAddressService } from './api-address.service';

@Module({
  providers: [ApiAddressService, ApiAddressResolver],
  exports: [ApiAddressService],
})
export class ApiAddressModule {}
