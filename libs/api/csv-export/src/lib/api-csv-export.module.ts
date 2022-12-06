import { Module } from '@nestjs/common';
import { ApiCsvExportController } from './api-csv-export.controller';
import { ApiCsvExportService } from './api-csv-export.service';

@Module({
  controllers: [ApiCsvExportController],
  providers: [ApiCsvExportService],
  exports: [ApiCsvExportService],
})
export class ApiCsvExportModule {}
