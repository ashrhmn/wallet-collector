import { Injectable } from '@nestjs/common';
import { PrismaService } from '@wallet-collector/prisma';

@Injectable()
export class ApiCsvExportService {
  constructor(private readonly prisma: PrismaService) {}

  async getCsvExportFile(id: number) {
    return await this.prisma.walletAddress
      .findMany({
        where: { projectId: id },
        select: { address: true },
      })
      .then((res) => res.map((r) => r.address));
  }
}
