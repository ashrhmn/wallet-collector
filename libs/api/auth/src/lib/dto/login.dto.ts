import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class LoginDto {
  @Field(() => String)
  usernameOrEmail: string;
  @Field(() => String)
  password: string;
}
