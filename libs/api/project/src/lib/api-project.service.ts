import { BadRequestException, Injectable } from '@nestjs/common';
import {
  DeleteOneProjectArgs,
  FindUniqueProjectOrThrowArgs,
} from '@wallet-collector/generated/prisma-dto';
import { PrismaService } from '@wallet-collector/prisma';
import { ICurrentUser } from '@wallet-collector/types';
import { CreateOneProjectArgsWithoutAuthor } from './dto/CreateOneProjectArgsWithoutAuthor.dto';
import { FindManyProjectArgsByUser } from './dto/FindManyProjectArgsByUser.dto';

@Injectable()
export class ApiProjectService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserProjects({
    args,
    currentUser,
    select,
  }: {
    args: FindManyProjectArgsByUser;
    select: any;
    currentUser: ICurrentUser;
  }) {
    return this.prisma.project.findMany({
      ...args,
      where: { ...args.where, authorId: currentUser.id },
      ...select,
    });
  }

  createUserProject({
    args,
    currentUser,
    select,
  }: {
    args: CreateOneProjectArgsWithoutAuthor;
    select: any;
    currentUser: ICurrentUser;
  }) {
    return this.prisma.project.create({
      ...args,
      data: { ...args.data, author: { connect: { id: currentUser.id } } },
      ...select,
    });
  }

  async getOneProject({
    args,
    select,
  }: {
    args: FindUniqueProjectOrThrowArgs;
    select: any;
  }) {
    return await this.prisma.project.findUniqueOrThrow({
      ...args,
      ...select,
    });
  }

  async deleteProject({
    args,
    currentUser,
  }: {
    args: DeleteOneProjectArgs;
    currentUser: ICurrentUser;
  }) {
    const project = await this.prisma.project.findFirst({
      where: { id: args.where.id },
    });

    if (!project) throw new BadRequestException('Project Not Found');

    if (currentUser.id !== project.authorId)
      throw new BadRequestException('You are not the project owner');

    await this.prisma.project.delete(args);

    return 'done';
  }
}
