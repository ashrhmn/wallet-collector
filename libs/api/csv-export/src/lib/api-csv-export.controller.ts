import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiCsvExportService } from './api-csv-export.service';

@Controller('csv-export')
export class ApiCsvExportController {
  constructor(private csvExportService: ApiCsvExportService) {}

  @Get(':id')
  async exportCsv(@Param('id') id: string, @Res() res: Response) {
    const data = await this.csvExportService.getCsvExportFile(+id);
    res.contentType('text/plain');
    res.attachment('export.csv').send(data.join('\n'));
  }
}
