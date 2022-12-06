import { ArgsType, Field, InputType, OmitType } from '@nestjs/graphql';
import { ProjectCreateInput } from '@wallet-collector/generated/prisma-dto';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

@InputType()
class ProjectCreateInputWithoutAuthor extends OmitType(ProjectCreateInput, [
  'author',
]) {}

@ArgsType()
export class CreateOneProjectArgsWithoutAuthor {
  @Field(() => ProjectCreateInputWithoutAuthor, { nullable: false })
  @Type(() => ProjectCreateInputWithoutAuthor)
  @ValidateNested()
  data!: ProjectCreateInputWithoutAuthor;
}
