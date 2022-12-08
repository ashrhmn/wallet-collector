import { Controller, Get, Param, Res } from '@nestjs/common';
import { CurrentUser } from '@wallet-collector/api/decorators';
import { Roles } from '@wallet-collector/api/guards';
import { ICurrentUser } from '@wallet-collector/types';
import { Response } from 'express';
import { ApiCsvExportService } from './api-csv-export.service';

@Controller('csv-export')
export class ApiCsvExportController {
  constructor(private csvExportService: ApiCsvExportService) {}

  @Roles('ADMIN', 'USER')
  @Get(':id')
  async exportCsv(
    @Param('id') id: string,
    @Res() res: Response,
    @CurrentUser() currentUser: ICurrentUser
  ) {
    const data = await this.csvExportService.getCsvExportFile({
      id: +id,
      currentUser,
    });
    res.contentType('text/plain');
    res.attachment('export.csv').send(data);
  }
}
