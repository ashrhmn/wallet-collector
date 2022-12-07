import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class ChangePasswordDto {
  @Field(() => String)
  oldPassword: string;
  @Field(() => String)
  newPassword: string;
  @Field(() => String)
  confirmNewPassword: string;
}
