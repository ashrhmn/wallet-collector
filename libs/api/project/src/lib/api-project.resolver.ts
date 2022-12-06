import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser, GqlSelect } from '@wallet-collector/api/decorators';
import { Roles } from '@wallet-collector/api/guards';
import {
  DeleteOneProjectArgs,
  FindUniqueProjectOrThrowArgs,
  Project,
} from '@wallet-collector/generated/prisma-dto';
import { ICurrentUser } from '@wallet-collector/types';
import { ApiProjectService } from './api-project.service';
import { CreateOneProjectArgsWithoutAuthor } from './dto/CreateOneProjectArgsWithoutAuthor.dto';
import { FindManyProjectArgsByUser } from './dto/FindManyProjectArgsByUser.dto';

@Resolver()
export class ApiProjectResolver {
  constructor(private readonly projectService: ApiProjectService) {}

  @Roles('ADMIN', 'USER')
  @Query(() => [Project])
  async getUserProjects(
    @Args() args: FindManyProjectArgsByUser,
    @CurrentUser() currentUser: ICurrentUser,
    @GqlSelect() select
  ) {
    return this.projectService.getUserProjects({ args, currentUser, select });
  }

  @Query(() => Project)
  async getOneProject(
    @Args() args: FindUniqueProjectOrThrowArgs,
    @GqlSelect() select
  ) {
    return this.projectService.getOneProject({ args, select });
  }

  @Roles('ADMIN', 'USER')
  @Mutation(() => Project)
  async createUserProject(
    @Args() args: CreateOneProjectArgsWithoutAuthor,
    @CurrentUser() currentUser: ICurrentUser,
    @GqlSelect() select
  ) {
    return this.projectService.createUserProject({ args, currentUser, select });
  }

  @Roles('ADMIN', 'USER')
  @Mutation(() => String)
  async deleteProject(
    @Args() args: DeleteOneProjectArgs,
    @CurrentUser() currentUser: ICurrentUser
  ) {
    return this.projectService.deleteProject({ args, currentUser });
  }
}
