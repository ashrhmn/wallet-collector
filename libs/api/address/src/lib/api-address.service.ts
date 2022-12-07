import { BadRequestException, Injectable } from '@nestjs/common';
import { Roles } from '@wallet-collector/api/guards';
import {
  CreateManyWalletAddressArgs,
  FindFirstWalletAddressArgs,
  FindManyWalletAddressArgs,
  WalletAddress,
} from '@wallet-collector/generated/prisma-dto';
import { PrismaService } from '@wallet-collector/prisma';
import { ICurrentUser } from '@wallet-collector/types';

@Injectable()
export class ApiAddressService {
  constructor(private readonly prisma: PrismaService) {}

  @Roles('ADMIN', 'USER')
  async getAddressesByProject({
    args,
    currentUser,
    select,
  }: {
    args: FindManyWalletAddressArgs;
    currentUser: ICurrentUser;
    select: any;
  }): Promise<WalletAddress[]> {
    const projectId = args.where?.projectId;
    if (!projectId)
      throw new BadRequestException('where.projectId is required');

    const project = await this.prisma.project.findFirst({
      where: { id: projectId },
    });

    if (!project) throw new BadRequestException('Invalid Project ID');

    if (project.authorId !== currentUser.id)
      throw new BadRequestException('You are not the project owner');

    return this.prisma.walletAddress.findMany({
      ...args,
      ...select,
    });
  }

  async addWalletAddresses({
    args,
    currentUser,
  }: {
    args: CreateManyWalletAddressArgs;
    currentUser: ICurrentUser;
  }): Promise<string> {
    const addedByUserId = currentUser ? currentUser.id : null;
    const projectIds = Array.from(new Set(args.data.map((d) => d.projectId)));

    if (projectIds.length > 1)
      throw new BadRequestException('Add addresses to one project at a time');

    const existingAddresses = await this.prisma.walletAddress
      .findMany({
        where: { projectId: projectIds[0] },
        select: { address: true },
      })
      .then((v) => v.map((v) => v.address));

    await this.prisma.walletAddress.createMany({
      ...args,
      data: args.data
        .map((d) => ({ ...d, addedByUserId }))
        .filter((d) => !existingAddresses.includes(d.address)),
    });
    return 'Added';
  }

  async walletAddressExists({ args }: { args: FindFirstWalletAddressArgs }) {
    if (!args.where?.projectId)
      throw new BadRequestException('where.projectId is required');
    const data = await this.prisma.walletAddress.findFirst(args);
    return !!data;
  }
}
