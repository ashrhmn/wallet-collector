import { ArgsType, Field, InputType, OmitType } from '@nestjs/graphql';
import {
  FindManyProjectArgs,
  ProjectWhereInput,
} from '@wallet-collector/generated/prisma-dto';
import { Type } from 'class-transformer';

@InputType()
class ProjectWhereInputWithoutAuthor extends OmitType(ProjectWhereInput, [
  'authorId',
  'author',
] as const) {}

@ArgsType()
export class FindManyProjectArgsByUser extends FindManyProjectArgs {
  @Field(() => ProjectWhereInputWithoutAuthor, {
    nullable: true,
  })
  @Type(() => ProjectWhereInputWithoutAuthor)
  where?: ProjectWhereInputWithoutAuthor | undefined;
}
