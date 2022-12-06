import { Module } from '@nestjs/common';
import { ApiProjectResolver } from './api-project.resolver';
import { ApiProjectService } from './api-project.service';

@Module({
  providers: [ApiProjectService, ApiProjectResolver],
  exports: [ApiProjectService],
})
export class ApiProjectModule {}
