import { BadRequestException } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from '@wallet-collector/api/guards';
import {
  CreateOneUserArgs,
  User,
} from '@wallet-collector/generated/prisma-dto';
import { ApiAuthService } from './api-auth.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { IContext, ICurrentUser } from '@wallet-collector/types';
import { CurrentUser } from '@wallet-collector/api/decorators';
import { ChangePasswordDto } from './dto/change-password.dto';

@Resolver()
export class ApiAuthResolver {
  constructor(private readonly authService: ApiAuthService) {}

  @Query(() => LoginResponseDto)
  async login(@Args() args: LoginDto): Promise<LoginResponseDto> {
    try {
      return this.authService.login(args);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Query(() => ICurrentUser)
  currentUser(@CurrentUser() currentUser: ICurrentUser) {
    if (!currentUser) throw new BadRequestException('No user logged in');
    return currentUser;
  }

  @Query(() => LoginResponseDto)
  async refreshToken(@Context() ctx: IContext): Promise<LoginResponseDto> {
    try {
      return this.authService.refreshToken(ctx.req);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Roles('ADMIN')
  @Mutation(() => User)
  async createUser(@Args() args: CreateOneUserArgs): Promise<User> {
    try {
      return this.authService.createUser(args);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Roles('ADMIN', 'USER')
  @Mutation(() => String)
  changePassword(
    @Args() args: ChangePasswordDto,
    @CurrentUser() currentUser: ICurrentUser
  ) {
    return this.authService.changePassword({ currentUser, args });
  }
}
