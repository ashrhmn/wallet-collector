import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@wallet-collector/prisma';
import { ICurrentUser } from '@wallet-collector/types';

@Injectable()
export class ApiCsvExportService {
  constructor(private readonly prisma: PrismaService) {}

  async getCsvExportFile({
    id,
    currentUser,
  }: {
    id: number;
    currentUser: ICurrentUser;
  }) {
    const project = await this.prisma.project.findFirst({
      where: { id },
      select: { authorId: true },
    });

    if (!project) throw new BadRequestException('Project Not Found');

    if (currentUser.id !== project.authorId)
      throw new BadRequestException('Unauthorized');

    const data = await this.prisma.walletAddress
      .findMany({
        where: { projectId: id },
        select: {
          address: true,
          addedBy: { select: { username: true, email: true } },
        },
      })
      .then((res) =>
        res.map((r) =>
          [r.address, r.addedBy?.username || r.addedBy?.email || ''].join(',')
        )
      );

    return 'address,added_by\n' + data.join('\n');
  }
}
